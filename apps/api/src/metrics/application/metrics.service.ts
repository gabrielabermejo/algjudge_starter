import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../../domain/entities/submission.entity';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepo: Repository<Submission>,
  ) {}

  async getMetrics() {
    const total = await this.submissionsRepo.count();
    const failed = await this.submissionsRepo.count({
      where: [
        { status: 'RUNTIME_ERROR' },
        { status: 'COMPILATION_ERROR' },
        { status: 'TIME_LIMIT_EXCEEDED' },
      ],
    });

    // Calcular tiempo promedio de ejecución
    const submissionsWithTime = await this.submissionsRepo
      .createQueryBuilder('s')
      .select('AVG(s.timeMsTotal)', 'avg')
      .where('s.timeMsTotal IS NOT NULL')
      .getRawOne();

    const averageExecutionTime = submissionsWithTime?.avg 
      ? Math.round(parseFloat(submissionsWithTime.avg)) 
      : 0;

    // Contar submissions por estado
    const byStatus = await this.submissionsRepo
      .createQueryBuilder('s')
      .select('s.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.status')
      .getRawMany();

    const statusCounts = byStatus.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count);
      return acc;
    }, {} as Record<string, number>);

    return {
      submissions_total: total,
      submissions_failed_total: failed,
      average_execution_time_ms: averageExecutionTime,
      submissions_by_status: statusCounts,
    };
  }
}

