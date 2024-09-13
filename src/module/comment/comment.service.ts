import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CommentRepository, InsertComment } from './comment.repository';
import { PostingService } from '../posting/posting.service';
import { PostingScoreService } from '../posting-score/posting-score.service';

@Injectable()
export class CommentService {
  constructor(
    private repository: CommentRepository,
    private postingService: PostingService,
    private postingScoreService: PostingScoreService,
  ) {}

  async createComment({
    memberId,
    postingId,
    content,
    commentId,
  }: InsertComment) {
    const comments = await this.repository.findManyComment({
      postingId,
      memberId,
      isDelete: false,
    });

    const posting = await this.postingService.readPosting({ postingId });
    // 첫 댓글 작성시에는 점수 증가
    if (!comments.length && posting.memberId !== memberId) {
      await this.postingScoreService.modifyPostingCommentUpScore({ postingId });
    }

    return await this.repository.insertComment({
      memberId,
      postingId,
      content,
      commentId,
    });
  }

  async readManyComment({ postingId }: { postingId: number }) {
    const comments = await this.repository.findManyComment({
      postingId,
    });

    const filteredComments = comments
      .filter((comment) => !comment.isDelete || comment.replies.length !== 0)
      .map((comment) => {
        if (comment.isManualRestrict === null) {
          if (comment.isAutoRestrict) {
            comment.content = '가려진 댓글입니다.';
          }
        } else if (comment.isManualRestrict) {
          comment.content = '가려진 댓글입니다.';
        }

        comment.replies.forEach((reply) => {
          if (reply.isManualRestrict === null) {
            if (reply.isAutoRestrict) {
              reply.content = '가려진 댓글입니다.';
            }
          } else {
            if (reply.isManualRestrict) {
              reply.content = '가려진 댓글입니다.';
            }
          }
        });

        if (comment.isDelete) {
          comment.content = '삭제된 댓글입니다.';
        }

        return comment;
      });

    return { comments: filteredComments };
  }

  async readComment({ commentId }: { commentId: number }) {
    const comment = await this.repository.findComment({ id: commentId });
    if (!comment) {
      throw new BadRequestException('존재하지 않은 댓글입니다.');
    }
    if (comment.isManualRestrict === null) {
      if (comment.isAutoRestrict) {
        throw new BadRequestException('블라인드 처리된 댓글입니다.');
      }
    } else if (comment.isManualRestrict) {
      throw new BadRequestException('블라인드 처리된 댓글입니다.');
    }

    return comment;
  }

  async modifyComment({
    commentId,
    content,
    memberId,
  }: {
    commentId: number;
    content: string;
    memberId: number;
  }) {
    const comment = await this.readComment({ commentId });
    if (comment.memberId !== memberId) {
      throw new ForbiddenException('Forbidden error...');
    }

    return await this.repository.updateComment({
      where: { id: commentId },
      data: { content },
    });
  }

  async removeComment({
    commentId,
    memberId,
  }: {
    commentId: number;
    memberId: number;
  }) {
    const comment = await this.readComment({ commentId });
    if (comment.memberId !== memberId) {
      throw new ForbiddenException('Forbidden error...');
    }

    const deleteResult = await this.repository.updateComment({
      where: { id: commentId },
      data: { isDelete: true },
    });

    if (comment.posting.memberId !== memberId) {
      const comments = await this.repository.findManyComment({
        postingId: comment.postingId,
        memberId: memberId,
        isDelete: false,
      });

      // 댓글이 전부 삭제됐다면 점수 차감
      if (!comments.length) {
        await this.postingScoreService.modifyPostingCommentDownScore({
          postingId: comment.postingId,
        });
      }
    }

    return deleteResult;
  }

  async readManyCommentReport({
    page,
    startDate,
    endDate,
    code,
    reportCount,
  }: {
    page: number;
    startDate?: Date;
    endDate?: Date;
    code?: string;
    reportCount?: number;
  }) {
    const options = { timeZone: 'Asia/Seoul' };

    const start = new Date(startDate);
    const searchStart = new Date(start.toLocaleString('en-US', options));
    searchStart.setUTCHours(0, 0, 0, 0);

    const end = new Date(endDate);
    const searchEnd = new Date(end.toLocaleString('en-US', options));
    searchEnd.setUTCHours(23, 59, 59, 999);

    const { comments, total, currentPage, lastPage } =
      await this.repository.findManyCommentReport({
        page,
        searchOptions: {
          startDate: searchStart,
          endDate: searchEnd,
          code,
          reportCount,
        },
      });

    const filteredComments = comments.filter((comment) => {
      const codeCondition = !code || comment.member.member_code === code;
      const reportCountCondition =
        !reportCount || comment.reports.length === reportCount;
      return codeCondition && reportCountCondition;
    });

    return { comments: filteredComments, total, currentPage, lastPage };
  }

  async readCommentReport({ commentId }: { commentId: number }) {
    const reportedComment = await this.repository.findCommentReport({
      id: commentId,
    });
    if (!reportedComment) {
      throw new BadRequestException('존재하지 않는 댓글입니다.');
    }

    return reportedComment;
  }

  async modifyCommentIsRestrict({
    commentId,
    isAutoRestrict,
    isManualRestrict,
  }: {
    commentId: number;
    isAutoRestrict?: boolean;
    isManualRestrict?: boolean;
  }) {
    await this.readCommentReport({ commentId });

    return await this.repository.updateComment({
      where: { id: commentId },
      data: {
        isAutoRestrict,
        isManualRestrict,
      },
    });
  }

  async modifyCommentIsManualRestrict({
    commentId,
    isManualRestrict,
  }: {
    commentId: number;
    isManualRestrict?: boolean;
  }) {
    return await this.repository.updateComment({
      where: { id: commentId },
      data: {
        isManualRestrict,
      },
    });
  }
}
