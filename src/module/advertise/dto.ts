import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum AdType {
  Quiz = 'Quiz',
  Save = 'Save',
}

export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  file: any;
}

export class CreateAdvertiseDto {
  @ApiPropertyOptional({ description: '관리자 계정일 경우에만 작성' })
  @IsNumber()
  @IsOptional()
  advertiserId: number;

  @ApiProperty()
  @IsEnum(AdType)
  @IsNotEmpty()
  adType: AdType;

  @ApiProperty({ example: '2024-06-13' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2024-06-13' })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  adCategory?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  adName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  adKeyword: string;

  @IsString()
  @IsOptional()
  adQuiz?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  adAnswer?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  placeUrl?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  dailyRequest: number;

  isMaxAchievement: boolean = false;
}

export class CreateManyAdvertiseDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  advertiserId: string;

  @ApiProperty()
  @IsEnum(AdType)
  @IsNotEmpty()
  adType: AdType;

  @ApiProperty({ example: '2024-06-13' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2024-06-13' })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  adCategory?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  adName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  adKeyword: string;

  @IsString()
  @IsOptional()
  adQuiz?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  adAnswer?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  placeUrl?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  dailyRequest: number;
}

export class ReadAdvertiseDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class ReadNextAdvertiseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  skipAds?: number[];
}

export class ReadAdLogDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  adId?: number;
}

export class ReadAdLogWithExcelDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  adId?: number;
}

export class ReadManyAdvertiseDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  advertiserId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  adName?: string;

  @ApiPropertyOptional()
  @IsEnum(AdType)
  @IsOptional()
  adType?: AdType;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  adCategory?: string;
}

export class ReadManyAdvertiseForExcelDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  advertiserId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  adName?: string;

  @ApiPropertyOptional()
  @IsEnum(AdType)
  @IsOptional()
  adType?: AdType;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  adCategory?: string;
}

export class ModifyAdvertiseDto {
  @ApiProperty()
  @IsEnum(AdType)
  @IsOptional()
  adType: AdType;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value === false ? false : true))
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  adCategory?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  adName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  adKeyword?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  adAnswer?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  placeUrl?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  dailyRequest?: number;

  @IsBoolean()
  @IsOptional()
  isMaxAchievement?: boolean;
}

export class CreateAdPointDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  adAnswer: string;
}

export class UpdateManyAdvertiseDto {
  @ApiProperty()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  adIds: number[];

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}

export class DeleteManyAdvertiseDto {
  @ApiProperty()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  adIds: number[];
}

export class ReadAdLogDashboardDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2024-06-13' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
