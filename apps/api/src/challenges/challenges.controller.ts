import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto, UpdateChallengeDto } from './dto';
import { Roles } from '../common/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/roles.guard';

@ApiTags('Challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private svc: ChallengesService) {}

  @Get()
  list() { return this.svc.list(); }

  @Get(':id')
  get(@Param('id') id: string) { return this.svc.get(id); }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateChallengeDto) { return this.svc.create(dto); }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChallengeDto) { return this.svc.update(id,dto); }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
