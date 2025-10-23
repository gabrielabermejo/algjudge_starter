import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { AuthGuard } from '@nestjs/passport';
import { IsString } from 'class-validator';

class SubmitDto {
  @IsString()
  challengeId!: string;

  @IsString()
  language!: string;
}

@ApiTags('Submissions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('submissions')
export class SubmissionsController {
  constructor(private svc: SubmissionsService) {}
  @Post()
  submit(@Body() dto: SubmitDto) {
    return this.svc.submit(dto);
  }
}
