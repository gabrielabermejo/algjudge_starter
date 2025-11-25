import { Injectable, NotFoundException } from '@nestjs/common';
import { ChallengesRepository } from '../infrastructure/challenges.repository';
import { Challenge, ChallengeState } from '../../domain/entities/challenge.entity';
import { CreateChallengeDto, UpdateChallengeDto } from '../dto';

@Injectable()
export class ChallengesService {
  constructor(private repo: ChallengesRepository) {}

  async list(state?: string): Promise<Challenge[]> {
    if (state && (state === 'draft' || state === 'published' || state === 'archived')) {
      return this.repo.findByState(state as ChallengeState);
    }
    return this.repo.findAll();
  }

  async get(id: string): Promise<Challenge> {
    const c = await this.repo.findById(id);
    if (!c) throw new NotFoundException('Challenge not found');
    return c;
  }

  async create(input: CreateChallengeDto): Promise<Challenge> {
    return this.repo.create(input);
  }

  async update(id: string, input: UpdateChallengeDto): Promise<Challenge> {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException('Challenge not found');
    return this.repo.update(id, input);
  }

  async remove(id: string): Promise<void> {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException('Challenge not found');
    await this.repo.delete(id);
  }
}
