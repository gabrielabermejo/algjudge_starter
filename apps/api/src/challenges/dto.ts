import { IsIn, IsInt, IsString, IsArray, Min, ArrayNotEmpty } from 'class-validator';
export class CreateChallengeDto {
  @IsString() title!: string;
  @IsString() description!: string;
  @IsIn(['easy','medium','hard']) difficulty!: 'easy'|'medium'|'hard';
  @IsArray() @ArrayNotEmpty() tags!: string[];
  @IsInt() @Min(1) timeLimit!: number;
  @IsInt() @Min(16) memoryLimit!: number;
  @IsIn(['draft','published','archived']) state!: 'draft'|'published'|'archived';
}
export class UpdateChallengeDto extends CreateChallengeDto {}
