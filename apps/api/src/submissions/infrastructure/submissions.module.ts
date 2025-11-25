import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsService } from '../application/submissions.service';
import { SubmissionsController } from '../interfaces/submissions.controller';
import { SubmissionsUpdateController } from '../interfaces/submissions-update.controller';
import { SubmissionsRepository } from './submissions.repository';
import { QueueModule } from '../../queue/infrastructure/queue.module';
import { ChallengesModule } from '../../challenges/infrastructure/challenges.module';
import { Submission } from '../../domain/entities/submission.entity';
import { Challenge } from '../../domain/entities/challenge.entity';
import { User } from '../../domain/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, Challenge, User]),
    QueueModule,
    ChallengesModule,
  ],
  providers: [SubmissionsService, SubmissionsRepository],
  controllers: [SubmissionsController, SubmissionsUpdateController],
  exports: [SubmissionsRepository],
})
export class SubmissionsModule {}
