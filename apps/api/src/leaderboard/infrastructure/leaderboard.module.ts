import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardService } from '../application/leaderboard.service';
import { LeaderboardController } from '../interfaces/leaderboard.controller';
import { SubmissionsRepository } from '../../submissions/infrastructure/submissions.repository';
import { Submission } from '../../domain/entities/submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  providers: [LeaderboardService, SubmissionsRepository],
  controllers: [LeaderboardController],
})
export class LeaderboardModule {}

