import { Challenge } from '../domain/challenge';

export interface IListChallenges {
  execute(): Promise<Challenge[]>;
}

export interface IGetChallenge {
  execute(id: string): Promise<Challenge>;
}

export interface ICreateChallenge {
  execute(input: Omit<Challenge, 'id'|'createdAt'|'updatedAt'>): Promise<Challenge>;
}

export interface IUpdateChallenge {
  execute(id: string, patch: Partial<Challenge>): Promise<Challenge>;
}

export interface IDeleteChallenge {
  execute(id: string): Promise<void>;
}
