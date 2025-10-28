import { Module } from '@nestjs/common';
import { SubmissionsService } from '../application/submissions.service';
import { SubmissionsController } from '../submissions.controller';
import { QueueModule } from '../../queue/infrastructure/queue.module';

@Module({
  imports: [QueueModule],
  providers: [SubmissionsService],
  controllers: [SubmissionsController],
})
export class SubmissionsModule {}
