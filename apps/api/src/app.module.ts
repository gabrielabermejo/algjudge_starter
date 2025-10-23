import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ChallengesModule } from './challenges/challenges.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [HealthModule, AuthModule, ChallengesModule, SubmissionsModule],
})
export class AppModule {}
