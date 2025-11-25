import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsService } from '../application/metrics.service';
import { MetricsController } from '../interfaces/metrics.controller';
import { Submission } from '../../domain/entities/submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  providers: [MetricsService],
  controllers: [MetricsController],
})
export class MetricsModule {}

