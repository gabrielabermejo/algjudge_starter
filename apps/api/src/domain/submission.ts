export type SubmissionStatus = 'QUEUED' | 'RUNNING' | 'ACCEPTED' | 'WRONG_ANSWER' | 'ERROR';

export interface Submission {
  id: string;
  challengeId: string;
  userId: string;
  language: 'python' | 'node' | 'cpp' | string;
  status: SubmissionStatus;
  createdAt?: string;
  updatedAt?: string;
}
