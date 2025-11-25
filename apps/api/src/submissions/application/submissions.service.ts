import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import type { Queue } from 'bull';
import { SubmissionsRepository } from '../infrastructure/submissions.repository';
import { Submission, SubmissionStatus } from '../../domain/entities/submission.entity';
import { ChallengesRepository } from '../../challenges/infrastructure/challenges.repository';

@Injectable()
export class SubmissionsService {
  private readonly logger = new Logger(SubmissionsService.name);

  constructor(
    @InjectQueue(process.env.REDIS_QUEUE_NAME || 'submissions')
    private queue: Queue<any>,
    private submissionsRepo: SubmissionsRepository,
    private challengesRepo: ChallengesRepository,
  ) {}

  async submit(body: { challengeId: string; language: string; code: string }, userId: string) {
    const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    
    this.logger.log(JSON.stringify({
      level: 'info',
      msg: 'Submission created',
      requestId,
      challengeId: body.challengeId,
      userId,
      language: body.language,
    }));

    // Verificar que el challenge existe
    const challenge = await this.challengesRepo.findById(body.challengeId);
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    // Crear submission en BD
    const submission = await this.submissionsRepo.create({
      userId,
      challengeId: body.challengeId,
      code: body.code,
      language: body.language as any,
      status: 'QUEUED' as SubmissionStatus,
    });

    // Obtener test cases (solo los no ocultos para workers)
    const testCases = challenge.testCases
      ?.filter(tc => !tc.isHidden)
      .map(tc => ({
        id: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })) || [];

    // Encolar job con el nombre del procesador según el lenguaje
    const processorName = body.language === 'python' ? 'python' : 
                          body.language === 'node' ? 'node' :
                          body.language === 'cpp' ? 'cpp' :
                          body.language === 'java' ? 'java' : 'default';

    await this.queue.add(
      processorName, // Nombre del procesador
      {
        submissionId: submission.id,
        challengeId: body.challengeId,
        language: body.language,
        code: body.code,
        timeLimit: challenge.timeLimit,
        memoryLimit: challenge.memoryLimit,
        testCases,
        requestId,
      },
      {
        jobId: submission.id,
        attempts: 1,
      }
    );

    this.logger.log(JSON.stringify({
      level: 'info',
      msg: 'Submission queued',
      submissionId: submission.id,
      requestId,
    }));

    return {
      id: submission.id,
      status: submission.status,
      createdAt: submission.createdAt,
    };
  }

  async getById(id: string): Promise<Submission> {
    const submission = await this.submissionsRepo.findById(id);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }
    return submission;
  }

  async updateStatus(
    id: string,
    status: SubmissionStatus,
    data?: {
      score?: number;
      timeMsTotal?: number;
      memoryKbTotal?: number;
      caseResults?: any[];
      compilationError?: string;
      runtimeError?: string;
    },
  ): Promise<Submission> {
    const submission = await this.submissionsRepo.update(id, {
      status,
      ...data,
    });

    this.logger.log(JSON.stringify({
      level: 'info',
      msg: 'Submission status updated',
      submissionId: id,
      status,
      score: data?.score,
    }));

    return submission;
  }
}
