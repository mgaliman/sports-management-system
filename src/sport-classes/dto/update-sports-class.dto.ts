import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSportsClassDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  sport?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  schedule?: string[];

  @IsOptional()
  @IsNumber()
  duration?: number;
}
