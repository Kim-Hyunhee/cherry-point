import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export type Payload = {
  member_idx: number | null;
  adminId: number | null;
  advertiserId: number | null;
};

export class CreateTokenDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  memberId: number;
}

export class CreateAdTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  advertiserId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: number;
}
