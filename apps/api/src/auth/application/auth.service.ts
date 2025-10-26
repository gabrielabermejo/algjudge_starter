import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type Role = 'ADMIN' | 'STUDENT';
@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async login(email: string, password: string) {
    // DEMO: credenciales por .env o defaults
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@demo.com';
    const adminPass  = process.env.ADMIN_PASS  || 'Admin123!';
    const stuEmail   = process.env.STU_EMAIL   || 'student@demo.com';
    const stuPass    = process.env.STU_PASS    || 'Student123!';

    let role: Role | null = null;
    if (email === adminEmail && password === adminPass) role = 'ADMIN';
    if (email === stuEmail && password === stuPass) role = 'STUDENT';
    if (!role) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: email, email, role };
    const token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'supersecret',
      expiresIn: '2h',
    });
    return { access_token: token, role };
  }
}
