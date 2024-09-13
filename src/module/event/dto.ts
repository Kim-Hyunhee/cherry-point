import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReadEventDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: 'yyyy-MM-dd' })
  @IsDateString()
  @IsOptional()
  startDateStart?: Date;

  @ApiPropertyOptional({ example: 'yyyy-MM-dd' })
  @IsDateString()
  @IsOptional()
  startDateEnd?: Date;

  @ApiPropertyOptional({ example: 'yyyy-MM-dd' })
  @IsDateString()
  @IsOptional()
  endDateStart?: Date;

  @ApiPropertyOptional({ example: 'yyyy-MM-dd' })
  @IsDateString()
  @IsOptional()
  endDateEnd?: Date;

  @ApiPropertyOptional({ example: 'yyyy-MM-dd' })
  @IsDateString()
  @IsOptional()
  insDateStart?: Date;

  @ApiPropertyOptional({ example: 'yyyy-MM-dd' })
  @IsDateString()
  @IsOptional()
  insDateEnd?: Date;
}
