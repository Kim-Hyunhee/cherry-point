import { BadRequestException, Injectable } from '@nestjs/common';
import {
  InsertCommentReport,
  InsertPostingReport,
  ReportRepository,
} from './report.repository';
import { PostingService } from '../posting/posting.service';
import { CommentService } from '../comment/comment.service';
import { LIKES_COUNT, REPORT_TIMES } from 'src/common/frequency';

@Injectable()
export class ReportService {
  constructor(
    private repository: ReportRepository,
    private postingService: PostingService,
    private commentService: CommentService,
  ) {}

  async createPostingReport({ memberId, postingId }: InsertPostingReport) {
    const posting = await this.postingService.readPosting({ postingId });

    await this.readPostingReport({ memberId, postingId });

    if (posting.memberPostingLikes.length < LIKES_COUNT) {
      if (posting.reports.length >= REPORT_TIMES) {
        await this.postingService.modifyPostingIsRestrict({
          postingId,
          isAutoRestrict: true,
        });
      }
    }

    return await this.repository.insertPostingReport({
      memberId,
      postingId,
    });
  }

  async createCommentReport({ memberId, commentId }: InsertCommentReport) {
    const comment = await this.commentService.readComment({ commentId });

    await this.readCommentReport({ memberId, commentId });

    if (comment.reports.length >= REPORT_TIMES) {
      await this.commentService.modifyCommentIsRestrict({
        commentId,
        isAutoRestrict: true,
      });
    }

    return await this.repository.insertCommentReport({
      memberId,
      commentId,
    });
  }

  async readPostingReport({
    memberId,
    postingId,
  }: {
    memberId: number;
    postingId: number;
  }) {
    const report = await this.repository.findPostingReport({
      memberId_postingId: { memberId, postingId },
    });
    if (report) {
      throw new BadRequestException('신고는 한 번만 가능합니다.');
    }

    return report;
  }

  async readCommentReport({
    memberId,
    commentId,
  }: {
    memberId: number;
    commentId: number;
  }) {
    const report = await this.repository.findCommentReport({
      memberId_commentId: { memberId, commentId },
    });
    if (report) {
      throw new BadRequestException('신고는 한 번만 가능합니다.');
    }

    return report;
  }
}
