export type ChallengeState = 'draft' | 'published' | 'archived';
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy'|'medium'|'hard';
  tags: string[];
  timeLimit: number;   // ms
  memoryLimit: number; // MB
  state: ChallengeState;
}
