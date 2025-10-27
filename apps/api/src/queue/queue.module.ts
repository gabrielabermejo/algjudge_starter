import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const QUEUE_NAME = process.env.REDIS_QUEUE_NAME || 'submissions';

@Module({
  imports: [
    BullModule.forRoot({
      redis: { host: REDIS_HOST, port: REDIS_PORT },
    }),
    BullModule.registerQueue({ name: QUEUE_NAME }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
