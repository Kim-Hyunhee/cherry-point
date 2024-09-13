import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class NotiMemberFilterDto {}

export class SendNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  msg: string;

  // @ApiProperty({
  //   example: [1, 2, 3],
  //   type: [Number],
  // })
  // @ArrayNotEmpty()
  // @Type(() => Number)
  // @IsNumber({}, { each: true })
  // memberIds: number[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  eventId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  memberCode?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  age?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  gender?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  cityCode?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  regionCode?: number;

  @ApiPropertyOptional({ example: 'yyyy-MM-dd' })
  @IsOptional()
  @IsDateString()
  insDateStart?: Date;

  @ApiPropertyOptional({ example: 'yyyy-MM-dd' })
  @IsOptional()
  @IsDateString()
  insDateEnd?: Date;

  @ApiPropertyOptional({ example: 'yyyy-MM-dd' })
  @IsOptional()
  @IsDateString()
  loginDateStart?: Date;

  @ApiPropertyOptional({ example: 'yyyy-MM-dd' })
  @IsOptional()
  @IsDateString()
  loginDateEnd?: Date;
}
