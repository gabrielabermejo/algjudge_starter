import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/infrastructure/health.module';
import { AuthModule } from './auth/infrastructure/auth.module';
import { ChallengesModule } from './challenges/infrastructure/challenges.module';
import { SubmissionsModule } from './submissions/infrastructure/submissions.module';
import { LeaderboardModule } from './leaderboard/infrastructure/leaderboard.module';
import { MetricsModule } from './metrics/infrastructure/metrics.module';
import { DatabaseModule } from './infrastructure/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule, 
    AuthModule, 
    ChallengesModule, 
    SubmissionsModule,
    LeaderboardModule,
    MetricsModule,
  ],
})
export class AppModule {}
