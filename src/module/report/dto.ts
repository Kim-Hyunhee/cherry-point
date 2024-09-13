import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostingReportDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postingId: number;
}

export class CreateCommentReportDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  commentId: number;
}
