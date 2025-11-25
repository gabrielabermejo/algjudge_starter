import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../domain/entities/user.entity';
import { Challenge } from '../domain/entities/challenge.entity';
import { Submission } from '../domain/entities/submission.entity';
import { TestCase } from '../domain/entities/testcase.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'db'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USER', 'algjudge'),
        password: configService.get('DB_PASSWORD', 'algjudge'),
        database: configService.get('DB_NAME', 'algjudge'),
        entities: [User, Challenge, Submission, TestCase],
        synchronize: true, // Habilitado para desarrollo - cambiar a false en producción
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Challenge, Submission, TestCase]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

