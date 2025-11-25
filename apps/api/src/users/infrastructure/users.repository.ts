import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findOrCreate(email: string, role: string, password?: string): Promise<User> {
    let user = await this.findByEmail(email);
    
    if (!user) {
      // Crear usuario si no existe
      const passwordHash = password 
        ? await bcrypt.hash(password, 10)
        : await bcrypt.hash('temp123', 10); // Password temporal
      
      user = this.repo.create({
        email,
        passwordHash,
        role: role as any,
      });
      user = await this.repo.save(user);
    }
    
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }
}

