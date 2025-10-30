import { Module } from '@nestjs/common';
import { ChallengesService } from '../application/challenges.service';
import { ChallengesController } from '../interfaces/challenges.controller';

@Module({
  providers: [ChallengesService],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
