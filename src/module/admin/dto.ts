import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePersonallyAdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: ['thumb1.jpg', 'thumb2.jpg'] })
  @IsString({ each: true })
  @IsNotEmpty()
  image: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  aosLink: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  iosLink: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  deepLink: string;
}

export class ModifyPersonallyAdIsShowDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isShow: boolean;
}

export class ModifyPersonallyAdDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({ example: ['thumb1.jpg', 'thumb2.jpg'] })
  @IsString({ each: true })
  @IsOptional()
  image: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  aosLink: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  iosLink: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  deepLink: string;
}

export class ReadManyReportDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: false, example: '2024-01-08' })
  @IsDateString()
  @IsOptional()
  startDate: Date;

  @ApiProperty({ required: false, example: '2024-01-08' })
  @IsDateString()
  @IsOptional()
  endDate: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  reportCount: number;
}

export class ModifyReportIsRestrictDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isManualRestrict: boolean;
}

export class ReadManyMemberDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  code: string;
}

export class ModifyMemberIsSnsActiveDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isSnsActive: boolean;
}

export class AdminLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateTodayHotPostingDto {
  @ApiProperty({ example: '2024-01-18' })
  @IsDateString()
  @IsNotEmpty()
  today: Date;
}
