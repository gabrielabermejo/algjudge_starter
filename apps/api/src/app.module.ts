import { Module } from '@nestjs/common';
import { HealthModule } from './health/infrastructure/health.module';
import { AuthModule } from './auth/infrastructure/auth.module';
import { ChallengesModule } from './challenges/infrastructure/challenges.module';
import { SubmissionsModule } from './submissions/infrastructure/submissions.module';

@Module({
  imports: [HealthModule, AuthModule, ChallengesModule, SubmissionsModule],
})
export class AppModule {}
