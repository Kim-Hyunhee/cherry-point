import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateKeywordLabLogDto {
  @ApiProperty()
  @IsString()
  media_user_key: string;

  @ApiProperty()
  @IsString()
  media_user_transkey: string;

  @ApiProperty()
  @IsString()
  mission_class: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  mission_seq: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  point: number;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  adType: string;
}
