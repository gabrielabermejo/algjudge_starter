export type Role = 'ADMIN' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  role: Role;
  passwordHash?: string;
}
