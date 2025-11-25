import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsArray, IsString, IsIn } from 'class-validator';
import { SubmissionsService } from '../application/submissions.service';
import type { SubmissionStatus } from '../../domain/entities/submission.entity';

class UpdateSubmissionDto {
  @IsString()
  @IsIn(['QUEUED', 'RUNNING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR'])
  status!: SubmissionStatus;
  
  @IsOptional()
  @IsNumber()
  score?: number;
  
  @IsOptional()
  @IsNumber()
  timeMsTotal?: number;
  
  @IsOptional()
  @IsNumber()
  memoryKbTotal?: number;
  
  @IsOptional()
  @IsArray()
  caseResults?: any[];
  
  @IsOptional()
  @IsString()
  compilationError?: string;
  
  @IsOptional()
  @IsString()
  runtimeError?: string;
}

@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionsUpdateController {
  constructor(private svc: SubmissionsService) {}

  @ApiOperation({ summary: 'Actualizar submission (interno para workers)' })
  @Put(':id/update')
  async update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.svc.updateStatus(id, dto.status, {
      score: dto.score,
      timeMsTotal: dto.timeMsTotal,
      memoryKbTotal: dto.memoryKbTotal,
      caseResults: dto.caseResults,
      compilationError: dto.compilationError,
      runtimeError: dto.runtimeError,
    });
  }
}

