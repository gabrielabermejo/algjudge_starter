import Queue from 'bull';

const queueName = process.env.REDIS_QUEUE_NAME || 'submissions';
const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10)
};

const submissionsQueue = new Queue(queueName, { redis: redisConfig });

console.log(`[worker_stub] Listening on queue "${queueName}" at ${redisConfig.host}:${redisConfig.port}`);

submissionsQueue.process(async (job) => {
  const { submissionId } = job.data;
  console.log(JSON.stringify({ submissionId, event: 'RUNNING' }));
  await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
  const accepted = Math.random() > 0.2;
  console.log(JSON.stringify({ submissionId, event: accepted ? 'ACCEPTED' : 'WRONG_ANSWER' }));
  return { status: accepted ? 'ACCEPTED' : 'WRONG_ANSWER' };
});
