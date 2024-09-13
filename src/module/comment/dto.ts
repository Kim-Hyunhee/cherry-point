import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postingId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  commentId: number;
}

export class ModifyCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
