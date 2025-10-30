import { IsIn, IsInt, IsString, IsArray, Min, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChallengeDto {
  @ApiProperty({ example: 'Suma', description: 'Título del reto' })
  @IsString() title!: string;

  @ApiProperty({ example: 'Lee A y B, imprime A+B' })
  @IsString() description!: string;

  @ApiProperty({ enum: ['easy','medium','hard'], example: 'easy' })
  @IsIn(['easy','medium','hard']) difficulty!: 'easy'|'medium'|'hard';

  @ApiProperty({ type: [String], example: ['math','io'] })
  @IsArray() @ArrayNotEmpty() tags!: string[];

  @ApiProperty({ example: 1000, description: 'Tiempo límite (ms)' })
  @IsInt() @Min(1) timeLimit!: number;

  @ApiProperty({ example: 128, description: 'Memoria límite (MB)' })
  @IsInt() @Min(16) memoryLimit!: number;

  @ApiProperty({ enum: ['draft','published','archived'], example: 'published' })
  @IsIn(['draft','published','archived']) state!: 'draft'|'published'|'archived';
}

export class UpdateChallengeDto extends CreateChallengeDto {}
