import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { LeaderboardService } from '../application/leaderboard.service';

@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private service: LeaderboardService) {}

  @ApiOperation({ summary: 'Leaderboard por reto', description: 'Obtiene el ranking de un reto específico' })
  @ApiParam({ name: 'challengeId', description: 'ID del reto' })
  @ApiQuery({ name: 'limit', required: false, description: 'Límite de resultados', example: 100 })
  @Get('challenge/:challengeId')
  async getByChallenge(
    @Param('challengeId') challengeId: string,
    @Query('limit') limit?: number,
  ) {
    return this.service.getByChallenge(challengeId, limit ? parseInt(limit.toString(), 10) : 100);
  }

  @ApiOperation({ summary: 'Submissions por usuario', description: 'Obtiene todos los submissions de un usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @Get('user/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.service.getByUser(userId);
  }
}

