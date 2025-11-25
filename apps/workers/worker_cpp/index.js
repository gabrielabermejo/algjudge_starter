import Queue from 'bull';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import axios from 'axios';

const execAsync = promisify(exec);

const queueName = process.env.REDIS_QUEUE_NAME || 'submissions';
const redisConfig = {
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10)
};

const API_URL = process.env.API_URL || 'http://api:3000';
const RUNNER_IMAGE = 'algjudge-runner-cpp:latest';

const submissionsQueue = new Queue(queueName, { redis: redisConfig });

console.log(`[worker_cpp] Listening on queue "${queueName}" at ${redisConfig.host}:${redisConfig.port}`);

submissionsQueue.process('cpp', async (job) => {
  const { submissionId, challengeId, code, timeLimit, memoryLimit, testCases, requestId } = job.data;
  
  const log = (level, msg, data = {}) => {
    console.log(JSON.stringify({
      level,
      msg,
      submissionId,
      requestId,
      ...data,
    }));
  };

  try {
    log('info', 'Processing submission', { challengeId, language: 'cpp' });

    await axios.put(`${API_URL}/submissions/${submissionId}/update`, {
      status: 'RUNNING',
    });

    if (testCases.length === 0) {
      throw new Error('No test cases found for challenge');
    }

    const caseResults = [];
    let totalTime = 0;
    let allAccepted = true;
    let compilationError = null;

    for (const testCase of testCases) {
      const startTime = Date.now();
      const tempDir = `/tmp/${submissionId}-${testCase.id}`;
      await execAsync(`mkdir -p ${tempDir}`);
      
      await fs.writeFile(`${tempDir}/input.txt`, testCase.input);
      await fs.writeFile(`${tempDir}/expected.txt`, testCase.expectedOutput);
      await fs.writeFile(`${tempDir}/code.cpp`, code);

      try {
        const dockerCmd = `docker run --rm --network none --cpus 0.5 --memory ${memoryLimit}m --read-only -v ${tempDir}:/data:rw ${RUNNER_IMAGE} /data/input.txt /data/expected.txt ${timeLimit} ${memoryLimit}`;
        
        const { stdout, stderr } = await execAsync(dockerCmd, {
          timeout: timeLimit + 15000, // Más tiempo para compilación
        });

        const executionTime = Date.now() - startTime;
        totalTime += executionTime;

        const status = stdout.trim();
        if (status === 'ACCEPTED') {
          caseResults.push({
            caseId: testCase.id,
            status: 'OK',
            timeMs: executionTime,
          });
        } else if (status === 'COMPILATION_ERROR') {
          compilationError = stderr;
          allAccepted = false;
          caseResults.push({
            caseId: testCase.id,
            status: 'COMPILATION_ERROR',
            timeMs: executionTime,
            error: stderr,
          });
          break;
        } else {
          allAccepted = false;
          caseResults.push({
            caseId: testCase.id,
            status: status === 'WRONG_ANSWER' ? 'WRONG_ANSWER' : 'RUNTIME_ERROR',
            timeMs: executionTime,
            output: stderr,
          });
          break;
        }
      } catch (error) {
        const executionTime = Date.now() - startTime;
        totalTime += executionTime;

        let errorStatus = 'RUNTIME_ERROR';
        let errorMsg = error.message;

        if (error.code === 'ETIMEDOUT' || error.signal === 'SIGTERM') {
          errorStatus = 'TIME_LIMIT_EXCEEDED';
        }

        allAccepted = false;
        caseResults.push({
          caseId: testCase.id,
          status: errorStatus,
          timeMs: executionTime,
          error: errorMsg,
        });
        break;
      } finally {
        await execAsync(`rm -rf ${tempDir}`).catch(() => {});
      }
    }

    const score = allAccepted ? 100 : Math.floor((caseResults.filter(c => c.status === 'OK').length / testCases.length) * 100);
    const finalStatus = compilationError ? 'COMPILATION_ERROR' : (allAccepted ? 'ACCEPTED' : caseResults[caseResults.length - 1].status);
    
    await axios.put(`${API_URL}/submissions/${submissionId}/update`, {
      status: finalStatus,
      score,
      timeMsTotal: totalTime,
      caseResults,
      compilationError,
    });

    log('info', 'Submission completed', { status: finalStatus, score, timeMsTotal: totalTime });

    return { status: finalStatus, score, timeMsTotal: totalTime };
  } catch (error) {
    log('error', 'Submission failed', { error: error.message });

    await axios.put(`${API_URL}/submissions/${submissionId}/update`, {
      status: 'RUNTIME_ERROR',
      runtimeError: error.message,
    }).catch(() => {});

    throw error;
  }
});

