import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bull'; // 👈 IMPORT TYPE

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectQueue(process.env.REDIS_QUEUE_NAME || 'submissions')
    private queue: Queue<any>, // 👈 evita metadata sobre el tipo
  ) {}

  async submit(body: { challengeId: string; language: string }) {
    const submissionId = Math.random().toString(36).slice(2);
    await this.queue.add({ submissionId, ...body });
    return { submissionId, status: 'QUEUED' };
  }
}
