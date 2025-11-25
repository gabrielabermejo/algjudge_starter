import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge, ChallengeState } from '../../domain/entities/challenge.entity';

@Injectable()
export class ChallengesRepository {
  constructor(
    @InjectRepository(Challenge)
    private repo: Repository<Challenge>,
  ) {}

  async findAll(): Promise<Challenge[]> {
    return this.repo.find({ relations: ['testCases'] });
  }

  async findById(id: string): Promise<Challenge | null> {
    return this.repo.findOne({ 
      where: { id }, 
      relations: ['testCases'] 
    });
  }

  async findByState(state: ChallengeState): Promise<Challenge[]> {
    return this.repo.find({ 
      where: { state }, 
      relations: ['testCases'] 
    });
  }

  async create(challenge: Partial<Challenge>): Promise<Challenge> {
    const entity = this.repo.create(challenge);
    return this.repo.save(entity);
  }

  async update(id: string, challenge: Partial<Challenge>): Promise<Challenge> {
    await this.repo.update(id, challenge);
    return this.findById(id) as Promise<Challenge>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

