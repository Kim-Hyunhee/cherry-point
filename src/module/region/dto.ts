import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ReadRegionDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  cityCode: number;
}
