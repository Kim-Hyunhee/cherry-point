import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PostingService } from '../posting/posting.service';
import { COMMENT_SCORE, HIT_SCORE, LIKE_SCORE } from 'src/common/score';

@Injectable()
export class PostingScoreService {
  constructor(
    @Inject(forwardRef(() => PostingService))
    private postingService: PostingService,
  ) {}

  async modifyPostingCommentUpScore({ postingId }: { postingId: number }) {
    const posting = await this.postingService.readPosting({ postingId });

    return await this.postingService.modifyPostingScore({
      postingId,
      commentScore: posting.commentScore + COMMENT_SCORE,
      totalScore: posting.totalScore + COMMENT_SCORE,
    });
  }

  async modifyPostingCommentDownScore({ postingId }: { postingId: number }) {
    const posting = await this.postingService.readPosting({ postingId });

    return await this.postingService.modifyPostingScore({
      postingId,
      commentScore: posting.commentScore - COMMENT_SCORE,
      totalScore: posting.totalScore - COMMENT_SCORE,
    });
  }

  async modifyPostingLikeUpScore({ postingId }: { postingId: number }) {
    const posting = await this.postingService.readPosting({ postingId });

    return await this.postingService.modifyPostingScore({
      postingId,
      likeScore: posting.likeScore + LIKE_SCORE,
      totalScore: posting.totalScore + LIKE_SCORE,
    });
  }

  async modifyPostingLikeDownScore({ postingId }: { postingId: number }) {
    const posting = await this.postingService.readPosting({ postingId });

    return await this.postingService.modifyPostingScore({
      postingId,
      likeScore: posting.likeScore - LIKE_SCORE,
      totalScore: posting.totalScore - LIKE_SCORE,
    });
  }

  async modifyPostingHitScore({ postingId }: { postingId: number }) {
    const posting = await this.postingService.readPosting({ postingId });

    return await this.postingService.modifyPostingScore({
      postingId,
      hitScore: posting.hitScore + +HIT_SCORE,
      totalScore: posting.totalScore + +HIT_SCORE,
    });
  }

  async modifyPostingHitCount({ postingId }: { postingId: number }) {
    const posting = await this.postingService.readPosting({ postingId });

    return await this.postingService.modifyPostingScore({
      postingId,
      hitCount: posting.hitCount + 1,
    });
  }
}
