import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../../domain/entities/submission.entity';

@Injectable()
export class SubmissionsRepository {
  constructor(
    @InjectRepository(Submission)
    private repo: Repository<Submission>,
  ) {}

  async findById(id: string): Promise<Submission | null> {
    return this.repo.findOne({ 
      where: { id },
      relations: ['user', 'challenge'],
    });
  }

  async findByUserId(userId: string): Promise<Submission[]> {
    return this.repo.find({ 
      where: { userId },
      relations: ['challenge'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByChallengeId(challengeId: string): Promise<Submission[]> {
    return this.repo.find({ 
      where: { challengeId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(submission: Partial<Submission>): Promise<Submission> {
    const entity = this.repo.create(submission);
    return this.repo.save(entity);
  }

  async update(id: string, submission: Partial<Submission>): Promise<Submission> {
    await this.repo.update(id, submission);
    return this.findById(id) as Promise<Submission>;
  }

  async findBestByChallengeAndUser(challengeId: string, userId: string): Promise<Submission | null> {
    return this.repo.findOne({
      where: { challengeId, userId },
      order: { 
        score: 'DESC',
        timeMsTotal: 'ASC',
        createdAt: 'ASC',
      },
    });
  }

  async findLeaderboardByChallenge(challengeId: string, limit: number = 100): Promise<Submission[]> {
    // Obtener todos los submissions aceptados para este challenge
    const allSubmissions = await this.repo.find({
      where: { 
        challengeId,
        status: 'ACCEPTED',
      },
      relations: ['user'],
      order: { 
        score: 'DESC',
        timeMsTotal: 'ASC',
        createdAt: 'ASC',
      },
    });

    // Agrupar por usuario y tomar el mejor de cada uno
    const bestByUser = new Map<string, Submission>();
    for (const submission of allSubmissions) {
      const existing = bestByUser.get(submission.userId);
      const subScore = submission.score ?? 0;
      const subTime = submission.timeMsTotal ?? Infinity;
      const existScore = existing?.score ?? 0;
      const existTime = existing?.timeMsTotal ?? Infinity;
      
      if (!existing || 
          subScore > existScore ||
          (subScore === existScore && subTime < existTime)) {
        bestByUser.set(submission.userId, submission);
      }
    }

    // Ordenar y limitar
    return Array.from(bestByUser.values())
      .sort((a, b) => {
        const aScore = a.score ?? 0;
        const bScore = b.score ?? 0;
        if (bScore !== aScore) return bScore - aScore;
        return (a.timeMsTotal ?? 0) - (b.timeMsTotal ?? 0);
      })
      .slice(0, limit);
  }
}

