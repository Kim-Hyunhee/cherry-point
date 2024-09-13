import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { PAGE_SIZE } from 'src/common/pagination';
import { InsertPosting, PostingRepository } from './posting.repository';
import { PostingScoreService } from '../posting-score/posting-score.service';
import { HotPostingService } from '../hot-posting/hot-posting.service';
import { PointService } from 'src/module/point/point.service';

@Injectable()
export class PostingService {
  constructor(
    private repository: PostingRepository,
    @Inject(forwardRef(() => PostingScoreService))
    private postingScoreService: PostingScoreService,
    private hotPostingService: HotPostingService,
    private pointService: PointService,
  ) {}

  async createPosting({ memberId, title, content, thumbs }: InsertPosting) {
    const totalPosting = await this.readMyTodayTotalPosting({ memberId });
    if (totalPosting >= 2) {
      throw new BadRequestException('일일 게시물 작성 개수를 초과했습니다.');
    }

    return await this.repository.insertPosting({
      memberId,
      title,
      content,
      thumbs,
    });
  }

  async readManyPosting({
    page,
    keyword,
    memberId,
  }: {
    page: number;
    keyword?: string;
    memberId?: number;
  }) {
    return await this.repository.findManyPosting({ page, keyword, memberId });
  }

  async readPosting({ postingId }: { postingId: number }) {
    const posting = await this.repository.findPosting({ id: postingId });

    if (!posting) {
      throw new BadRequestException('존재하지 않는 게시물입니다.');
    }
    if (posting.isDelete) {
      throw new BadRequestException('삭제된 게시물입니다.');
    }
    if (posting.isManualRestrict === null) {
      if (posting.isAutoRestrict) {
        throw new BadRequestException('블라인드 처리된 게시물입니다.');
      }
    } else if (posting.isManualRestrict) {
      throw new BadRequestException('블라인드 처리된 게시물입니다.');
    }

    return posting;
  }

  async modifyPosting({
    memberId,
    postingId,
    title,
    content,
    thumbs,
  }: {
    memberId: number;
    postingId: number;
    title: string;
    content: string;
    thumbs: string[];
  }) {
    const posting = await this.readPosting({ postingId });
    if (posting.memberId !== memberId) {
      throw new ForbiddenException('Forbidden error...');
    }

    return await this.repository.updatePosting({
      where: { id: postingId },
      data: { title, content, thumbs },
    });
  }

  async removePosting({
    postingId,
    memberId,
  }: {
    postingId: number;
    memberId: number;
  }) {
    const posting = await this.readPosting({ postingId });
    if (posting.memberId !== memberId) {
      throw new ForbiddenException('Forbidden error...');
    }

    return await this.repository.updatePosting({
      where: { id: postingId },
      data: { isDelete: true },
    });
  }

  async readMemberPostingLike({
    memberId,
    postingId,
  }: {
    memberId: number;
    postingId: number;
  }) {
    const postingLike = await this.repository.findMemberPostingLike({
      memberId_postingId: { memberId, postingId },
    });
    if (postingLike) {
      throw new BadRequestException('좋아요는 한 번만 누를 수 있습니다.');
    }

    return postingLike;
  }

  async createMemberPostingLike({
    memberId,
    postingId,
  }: {
    memberId: number;
    postingId: number;
  }) {
    const posting = await this.readPosting({ postingId });
    if (posting.memberId === memberId) {
      throw new BadRequestException(
        '본인이 작성한 글은 좋아요를 누를 수 없습니다.',
      );
    }

    await this.readMemberPostingLike({ postingId, memberId });

    await this.postingScoreService.modifyPostingLikeUpScore({ postingId });

    return await this.repository.insertMemberPostingLike({
      memberId,
      postingId,
    });
  }

  async removeMemberPostingLike({
    memberId,
    postingId,
  }: {
    memberId: number;
    postingId: number;
  }) {
    await this.postingScoreService.modifyPostingLikeDownScore({ postingId });

    return await this.repository.deleteMemberPostingLike({
      memberId_postingId: { memberId, postingId },
    });
  }

  async createMemberPostingHit({
    memberId,
    postingId,
  }: {
    memberId: number;
    postingId: number;
  }) {
    const posting = await this.readPosting({ postingId });
    if (posting.memberId === memberId) {
      return posting;
    }

    const postingHit = await this.readMemberPostingHit({ memberId, postingId });
    if (postingHit) {
      await this.postingScoreService.modifyPostingHitCount({ postingId });

      return postingHit;
    }

    await this.postingScoreService.modifyPostingHitCount({ postingId });
    await this.postingScoreService.modifyPostingHitScore({ postingId });

    return await this.repository.insertMemberPostingHit({
      memberId,
      postingId,
    });
  }

  async readMemberPostingHit({
    memberId,
    postingId,
  }: {
    memberId: number;
    postingId: number;
  }) {
    return await this.repository.findMemberPostingHit({
      memberId_postingId: { memberId, postingId },
    });
  }

  async readManyPostingReport({
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

    const { postings, currentPage } =
      await this.repository.findManyPostingReport({
        page,
        searchOptions: {
          startDate: searchStart,
          endDate: searchEnd,
          code,
          reportCount,
        },
      });

    const filteredPostings = postings.filter((posting) => {
      const codeCondition = !code || posting.member.member_code === code;
      const reportCountCondition =
        !reportCount || posting.reports.length >= reportCount;
      return codeCondition && reportCountCondition;
    });
    const skipAmount = (page - 1) * PAGE_SIZE;
    const slicedPostings = filteredPostings.slice(
      skipAmount,
      skipAmount + PAGE_SIZE,
    );
    const total = filteredPostings.length;
    const lastPage = +Math.ceil(total / PAGE_SIZE);
    return {
      postings: slicedPostings,
      total,
      currentPage,
      lastPage,
    };
  }

  async readPostingReport({ postingId }: { postingId: number }) {
    const reportedPosting = await this.repository.findPostingReport({
      id: postingId,
    });
    if (!reportedPosting) {
      throw new BadRequestException('존재하지 않는 게시물입니다.');
    }

    return reportedPosting;
  }

  async modifyPostingIsRestrict({
    postingId,
    isAutoRestrict,
    isManualRestrict,
  }: {
    postingId: number;
    isAutoRestrict?: boolean;
    isManualRestrict?: boolean;
  }) {
    await this.readPostingReport({ postingId });

    return await this.repository.updatePosting({
      where: { id: postingId },
      data: { isAutoRestrict, isManualRestrict },
    });
  }

  async modifyPostingScore({
    postingId,
    commentScore,
    likeScore,
    hitScore,
    hitCount,
    totalScore,
  }: {
    postingId: number;
    commentScore?: number;
    likeScore?: number;
    hitScore?: number;
    hitCount?: number;
    totalScore?: number;
  }) {
    return await this.repository.updatePosting({
      where: { id: postingId },
      data: {
        commentScore,
        likeScore,
        hitScore,
        hitCount,
        totalScore,
      },
    });
  }

  async readMyTodayTotalPosting({ memberId }: { memberId: number }) {
    const options = { timeZone: 'Asia/Seoul' };

    const today = new Date();

    const startDate = new Date(today.toLocaleString('en-US', options));
    startDate.setUTCDate(startDate.getDate());
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(today.toLocaleString('en-US', options));
    endDate.setUTCHours(23, 59, 59, 999);

    return await this.repository.findMyTodayPosting({
      memberId,
      startDate,
      endDate,
    });
  }

  async createTodayHotPosting({ today }: { today: Date }) {
    const options = { timeZone: 'Asia/Seoul' };

    // 5일 전부터 오늘까지의 50개 게시물 목록
    const startDate = new Date(today.toLocaleString('en-US', options));
    startDate.setUTCDate(startDate.getDate() - 4);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(today.toLocaleString('en-US', options));
    endDate.setUTCHours(23, 59, 59, 999);

    const hotPostings = await this.repository.findManyHotPosting({
      startDate,
      endDate,
    });

    const postingPointMap = await this.pointService.createHotPostingPoint({
      hotPostings,
    });

    // 포인트로 필터링된 인기 게시물 생성
    const filteredHotPostings = hotPostings.map((posting) => {
      const postingId = posting.id;
      const paidPoint = postingPointMap.get(postingId) || 0;

      delete posting.comments;
      delete posting.memberPostingLikes;

      return { ...posting, paidPoint };
    });

    // 저장 날짜와 함께 필터링된 인기 게시물 데이터 저장
    const savedDate = new Date(today.toLocaleString('en-US', options));
    savedDate.setUTCDate(savedDate.getDate());
    savedDate.setUTCHours(0, 0, 0, 0);

    return await this.hotPostingService.createHotPosting({
      postingContent: filteredHotPostings,
      savedDate,
    });
  }

  async readManyHotPosting({ today }: { today: Date }) {
    const options = { timeZone: 'Asia/Seoul' };

    const startDate = new Date(today.toLocaleString('en-US', options));
    startDate.setUTCDate(startDate.getDate() - 4);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(today.toLocaleString('en-US', options));
    endDate.setUTCHours(23, 59, 59, 999);

    return await this.repository.findManyHotPosting({
      startDate,
      endDate,
    });
  }
}
