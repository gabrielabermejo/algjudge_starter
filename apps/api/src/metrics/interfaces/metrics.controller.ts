import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MetricsService } from '../application/metrics.service';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private service: MetricsService) {}

  @ApiOperation({ summary: 'Obtener métricas del sistema' })
  @Get()
  async getMetrics() {
    return this.service.getMetrics();
  }
}

