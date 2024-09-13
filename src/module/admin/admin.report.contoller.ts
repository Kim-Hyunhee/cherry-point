import {
  Query,
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ModifyReportIsRestrictDto, ReadManyReportDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostingService } from '../posting/posting.service';
import { CommentService } from '../comment/comment.service';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('admin')
@ApiBearerAuth('access-token')
@UseGuards(AdminGuard)
@UseGuards(JwtAuthGuard)
@Controller('admin/report')
export class AdminReportController {
  constructor(
    private postingService: PostingService,
    private commentService: CommentService,
  ) {}

  @Get('/posting')
  async getPostingReport(@Query() query: ReadManyReportDto) {
    return await this.postingService.readManyPostingReport(query);
  }

  @Get('/comment')
  async getCommentReport(@Query() query: ReadManyReportDto) {
    return await this.commentService.readManyCommentReport(query);
  }

  @Patch('/posting/:id/is-restrict')
  async patchPostingIsRestrict(
    @Param('id', ParseIntPipe) postingId: number,
    @Body() { isManualRestrict }: ModifyReportIsRestrictDto,
  ) {
    return await this.postingService.modifyPostingIsRestrict({
      postingId,
      isManualRestrict,
    });
  }

  @Patch('/comment/:id/is-restrict')
  async patchCommentIsRestrict(
    @Param('id', ParseIntPipe) commentId: number,
    @Body() { isManualRestrict }: ModifyReportIsRestrictDto,
  ) {
    return await this.commentService.modifyCommentIsManualRestrict({
      commentId,
      isManualRestrict,
    });
  }
}
