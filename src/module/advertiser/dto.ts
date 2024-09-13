import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PointType {
  Increase = 'Increase',
  Decrease = 'Decrease',
}

export class CreateAdvertiserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  advertiserId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  trafficPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  urlPrice: number;
}

export class ModifyAdvertiserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isDelete?: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  trafficPrice?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  urlPrice?: number;
}

export class ModifyAdvertiserSelfDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  userName?: string;
}

export class ModifyAdvertiserPointDto {
  @ApiProperty()
  @IsEnum(PointType)
  @IsNotEmpty()
  type: PointType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  point: number;
}

export class ReadManyAdvertiserDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  advertiserId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}

export class ReadManyAdvertiserPointDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  page: number;

  //  광고주의 numbericId
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  advertiserId?: number;

  //  광고주 로그인시 Id
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}

export class ReadManyAdvertiserPointSelfDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  page: number;

  //  광고주의 numbericId
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  advertiserId?: number;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}

export class ReadAdverTiserDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  advertiserId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userName?: string;
}

export class ReadAdvertiserIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  advertiserId?: string;
}

export class AdvertiserLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  advertiserId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ReadSimilarAdvertiserDto {
  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // advertiserId?: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // userName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchWord?: string;
}

export class UpdateDailyPoint {
  advertiserId: number;
  point: number;
}
