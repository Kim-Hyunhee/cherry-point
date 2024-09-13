import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ResponseDto {
  @IsString()
  code: string;

  @IsString()
  code_msg: string;

  @IsOptional()
  @IsNumber()
  member_point: number;
}
