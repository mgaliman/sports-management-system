import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateSportsClassDto {
  @IsString()
  title: string;

  @IsString()
  sport: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  schedule: string[];

  @IsNumber()
  duration: number;
}
