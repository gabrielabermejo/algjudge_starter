import { Injectable } from '@nestjs/common';
import { SubmissionsRepository } from '../../submissions/infrastructure/submissions.repository';

@Injectable()
export class LeaderboardService {
  constructor(private submissionsRepo: SubmissionsRepository) {}

  async getByChallenge(challengeId: string, limit: number = 100) {
    return this.submissionsRepo.findLeaderboardByChallenge(challengeId, limit);
  }

  async getByUser(userId: string) {
    return this.submissionsRepo.findByUserId(userId);
  }
}

