import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SubmissionsService } from '../application/submissions.service';
import { AuthGuard } from '@nestjs/passport';
import { IsString } from 'class-validator';

class SubmitDto {
  @IsString()
  challengeId!: string;

  @IsString()
  language!: string;

  @IsString()
  code!: string;
}

@ApiTags('Submissions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('submissions')
export class SubmissionsController {
  constructor(private svc: SubmissionsService) {}

  @ApiOperation({ summary: 'Enviar solución', description: 'Envía código para ser evaluado' })
  @ApiResponse({ status: 201, description: 'Submission creado y encolado' })
  @ApiResponse({ status: 404, description: 'Challenge no encontrado' })
  @Post()
  async submit(@Body() dto: SubmitDto, @Request() req: any) {
    // req.user.sub ahora contiene el UUID del usuario (no el email)
    const userId = req.user.sub || req.user.userId;
    if (!userId) {
      throw new Error('User ID not found in token');
    }
    return this.svc.submit(dto, userId);
  }

  @ApiOperation({ summary: 'Obtener submission por ID', description: 'Consulta el estado de un submission' })
  @ApiParam({ name: 'id', description: 'ID del submission' })
  @ApiResponse({ status: 200, description: 'Submission encontrado' })
  @ApiResponse({ status: 404, description: 'Submission no encontrado' })
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.svc.getById(id);
  }
}
