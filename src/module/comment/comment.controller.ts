import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto, ModifyCommentDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentMember } from 'src/decorators/currentMember.decorator';
import { tbl_member } from '@prisma/client';

@ApiTags('comment')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  async postComment(
    @Body() body: CreateCommentDto,
    @CurrentMember() member: tbl_member,
  ) {
    return await this.commentService.createComment({
      memberId: member.member_idx,
      ...body,
    });
  }

  @Put(':id')
  async putComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Body() { content }: ModifyCommentDto,
    @CurrentMember() member: tbl_member,
  ) {
    return await this.commentService.modifyComment({
      commentId,
      content,
      memberId: member.member_idx,
    });
  }

  @Delete(':id')
  async deleteComment(
    @Param('id', ParseIntPipe) commentId: number,
    @CurrentMember() member: tbl_member,
  ) {
    return await this.commentService.removeComment({
      commentId,
      memberId: member.member_idx,
    });
  }
}
