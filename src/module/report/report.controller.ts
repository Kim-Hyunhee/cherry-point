import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { CreateCommentReportDto, CreatePostingReportDto } from './dto';
import { CurrentMember } from 'src/decorators/currentMember.decorator';
import { tbl_member } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('report')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post('/posting')
  async postPostingReport(
    @Body() { postingId }: CreatePostingReportDto,
    @CurrentMember() member: tbl_member,
  ) {
    return await this.reportService.createPostingReport({
      memberId: member.member_idx,
      postingId,
    });
  }

  @Post('/comment')
  async postCommentReport(
    @Body() { commentId }: CreateCommentReportDto,
    @CurrentMember() member: tbl_member,
  ) {
    return await this.reportService.createCommentReport({
      memberId: member.member_idx,
      commentId,
    });
  }
}
