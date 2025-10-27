export type Difficulty = 'easy' | 'medium' | 'hard';
export type ChallengeState = 'draft' | 'published' | 'archived';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  timeLimit: number;   // ms
  memoryLimit: number; // MB
  state: ChallengeState;
  createdAt?: string;
  updatedAt?: string;
}
