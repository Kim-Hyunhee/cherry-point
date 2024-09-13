import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateGreenPDto {
  @ApiProperty()
  @IsString()
  regType: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  appUid: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  rwdCost: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  adsIdx: number;

  @ApiProperty()
  @IsString()
  adsName: string;

  @ApiProperty()
  @IsString()
  adsReParticipate: string;
}
