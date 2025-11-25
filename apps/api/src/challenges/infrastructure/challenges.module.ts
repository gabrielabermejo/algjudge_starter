import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesService } from '../application/challenges.service';
import { ChallengesController } from '../interfaces/challenges.controller';
import { ChallengesRepository } from './challenges.repository';
import { Challenge } from '../../domain/entities/challenge.entity';
import { TestCase } from '../../domain/entities/testcase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge, TestCase])],
  providers: [ChallengesService, ChallengesRepository],
  controllers: [ChallengesController],
  exports: [ChallengesRepository],
})
export class ChallengesModule {}
