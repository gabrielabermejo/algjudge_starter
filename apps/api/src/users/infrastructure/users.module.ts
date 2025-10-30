import { Module } from '@nestjs/common';
import { UsersService } from '../application/users.service';

@Module({
  providers: [UsersService]
})
export class UsersModule {}
