import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReadSystemDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  @IsOptional()
  trafficReward?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  @IsOptional()
  placeReward?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  @IsOptional()
  bonusReward?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  @IsOptional()
  trafficInfoImg?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  @IsOptional()
  placeInfoImg?: boolean;
}

export class ModifySystemDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  trafficReward?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  placeReward?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  bonusReward?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  trafficInfoImg?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  placeInfoImg?: string;
}
