import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(private repo: UsersRepository) {}

  async findOrCreateByEmail(email: string, role: string): Promise<string> {
    const user = await this.repo.findOrCreate(email, role);
    return user.id; // Retorna el UUID
  }

  async findByEmail(email: string) {
    return this.repo.findByEmail(email);
  }
}
