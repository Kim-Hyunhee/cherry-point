import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePostingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: ['thumb1.jpg', 'thumb2.jpg'] })
  @IsString({ each: true })
  @IsNotEmpty()
  thumbs: string[];
}

export class ReadManyPostingDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  memberId: number;
}

export class ModifyPostingDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({ example: ['thumb1.jpg', 'thumb2.jpg'] })
  @IsString({ each: true })
  @IsOptional()
  thumbs: string[];
}

export class ReadManyHotPostingDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  today: Date;
}
