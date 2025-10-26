import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto, UpdateChallengeDto } from '../dto';
import { Roles } from '../../common/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/roles.guard';

@ApiTags('Challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private svc: ChallengesService) {}

  @ApiOperation({ summary: 'Listar retos', description: 'Retorna todos los retos disponibles (público).' })
  @ApiResponse({ status: 200, description: 'Listado de retos devuelto correctamente.' })
  @Get()
  list() { return this.svc.list(); }

  @ApiOperation({ summary: 'Obtener reto por ID' })
  @ApiParam({ name: 'id', description: 'ID del reto', example: 'b8d9f7a2-1234-4a9c-9c01-aaaa1111bbbb' })
  @ApiResponse({ status: 200, description: 'Reto encontrado.' })
  @ApiResponse({ status: 404, description: 'Reto no encontrado.' })
  @Get(':id')
  get(@Param('id') id: string) { return this.svc.get(id); }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Crear reto (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Reto creado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @Post()
  create(@Body() dto: CreateChallengeDto) { return this.svc.create(dto); }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar reto (ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID del reto' })
  @ApiResponse({ status: 200, description: 'Reto actualizado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Reto no encontrado.' })
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChallengeDto) { return this.svc.update(id,dto); }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar reto (ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID del reto' })
  @ApiResponse({ status: 200, description: 'Reto eliminado.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Reto no encontrado.' })
  @Delete(':id')
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
