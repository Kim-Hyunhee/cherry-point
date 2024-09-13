import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAdQuizDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quiz: string;
}

export class CreateManyAdQuizDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  quiz: string[];
}

export class ReadAdQuizDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  quiz?: string;
}

export class UpdateAdQuizDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quiz: string;
}
