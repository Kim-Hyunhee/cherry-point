import { Injectable } from '@nestjs/common';
import { HOT_POSTING_PAGE_SIZE, PAGE_SIZE } from 'src/common/pagination';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class PostingRepository {
  constructor(private prisma: PrismaService) {}

  async insertPosting(data: InsertPosting) {
    return await this.prisma.posting.create({ data });
  }

  async findManyPosting({
    page,
    keyword,
    memberId,
  }: {
    page: number;
    keyword?: string;
    memberId?: number;
  }) {
    const skipAmount = (page - 1) * PAGE_SIZE;

    const or = keyword
      ? {
          OR: [
            { title: { contains: keyword as string } },
            { content: { contains: keyword as string } },
          ],
        }
      : {};

    const postings = await this.prisma.posting.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: {
        isDelete: false,
        AND: or,
        memberId,
        OR: [
          { isManualRestrict: false },
          { isAutoRestrict: true, isManualRestrict: false },
          { isAutoRestrict: false, isManualRestrict: null },
        ],
      },
      include: {
        memberPostingLikes: true,
        member: {
          select: { member_idx: true, member_code: true, profileImage: true },
        },
        comments: { where: { isDelete: false } },
        reports: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.posting.count({
      where: {
        isDelete: false,
        AND: or,
        memberId,
        OR: [
          { isManualRestrict: false },
          { isAutoRestrict: true, isManualRestrict: false },
          { isAutoRestrict: false, isManualRestrict: null },
        ],
      },
    });
    const currentPage = page;
    const lastPage = +Math.ceil(total / PAGE_SIZE);

    return { postings, total, currentPage, lastPage };
  }

  async findPosting(where: { id: number }) {
    return await this.prisma.posting.findUnique({
      where,
      include: {
        memberPostingLikes: true,
        member: {
          select: { member_idx: true, member_code: true, profileImage: true },
        },
        comments: {
          where: { isDelete: false, commentId: null },
          include: {
            member: {
              select: {
                member_idx: true,
                member_code: true,
                profileImage: true,
              },
            },
            replies: {
              include: {
                member: {
                  select: {
                    member_idx: true,
                    member_code: true,
                    profileImage: true,
                  },
                },
              },
            },
          },
        },
        reports: true,
      },
    });
  }

  async updatePosting({
    where,
    data,
  }: {
    where: { id: number };
    data: UpdatePosting;
  }) {
    return await this.prisma.posting.update({ where, data });
  }

  async insertMemberPostingLike(data: { memberId: number; postingId: number }) {
    return await this.prisma.memberPostingLike.create({ data });
  }

  async findMemberPostingLike(where: {
    memberId_postingId: { memberId: number; postingId: number };
  }) {
    return await this.prisma.memberPostingLike.findUnique({ where });
  }

  async deleteMemberPostingLike(where: {
    memberId_postingId: { memberId: number; postingId: number };
  }) {
    return await this.prisma.memberPostingLike.delete({ where });
  }

  async insertMemberPostingHit(data: { memberId: number; postingId: number }) {
    return await this.prisma.memberPostingHit.create({ data });
  }

  async findMemberPostingHit(where: {
    memberId_postingId: { memberId: number; postingId: number };
  }) {
    return await this.prisma.memberPostingHit.findUnique({ where });
  }

  async findManyPostingReport({
    page,
    searchOptions,
  }: {
    page: number;
    searchOptions?: {
      startDate?: Date;
      endDate?: Date;
      code?: string;
      reportCount?: number;
    };
  }) {
    const whereCondition: {
      createdAt?: { gte?: Date; lte?: Date };
    } = {};

    const memberCondition: {
      member_code?: string;
    } = {};

    if (searchOptions) {
      if (searchOptions.startDate) {
        whereCondition.createdAt = {
          gte: searchOptions.startDate,
          lte: searchOptions.endDate,
        };
      }
      if (searchOptions.code) {
        memberCondition.member_code = searchOptions.code;
      }
    }

    const postings = await this.prisma.posting.findMany({
      where: {
        member: { ...memberCondition },
        ...whereCondition,
        isDelete: false,
      },
      include: {
        member: {
          select: { member_idx: true, member_code: true, profileImage: true },
        },
        comments: {
          where: { isDelete: false, commentId: null },
          include: {
            member: {
              select: {
                member_idx: true,
                member_code: true,
                profileImage: true,
              },
            },
            replies: {
              include: {
                member: {
                  select: {
                    member_idx: true,
                    member_code: true,
                    profileImage: true,
                  },
                },
              },
            },
          },
        },
        memberPostingHits: true,
        memberPostingLikes: true,
        reports: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.posting.count({
      where: { member: { ...memberCondition }, ...whereCondition },
    });
    const currentPage = page;
    const lastPage = +Math.ceil(total / PAGE_SIZE);

    return { postings, total, currentPage, lastPage };
  }

  async findPostingReport(where: { id: number }) {
    return await this.prisma.posting.findUnique({
      where: { ...where },
      include: {
        member: {
          select: { member_idx: true, member_code: true, profileImage: true },
        },
        comments: {
          where: { isDelete: false, commentId: null },
          include: {
            member: {
              select: {
                member_idx: true,
                member_code: true,
                profileImage: true,
              },
            },
            replies: {
              include: {
                member: {
                  select: {
                    member_idx: true,
                    member_code: true,
                    profileImage: true,
                  },
                },
              },
            },
          },
        },
        memberPostingHits: true,
        memberPostingLikes: true,
        reports: true,
      },
    });
  }

  async findMyTodayPosting(where: {
    memberId: number;
    startDate: Date;
    endDate: Date;
  }) {
    const whereCondition = {
      createdAt: {
        gte: new Date(where.startDate),
        lte: new Date(where.endDate),
      },
    };

    const todayTotal = await this.prisma.posting.count({
      where: { ...whereCondition, memberId: where.memberId },
    });

    return todayTotal;
  }

  async findManyHotPosting({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }) {
    const whereCondition = {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    };

    return await this.prisma.posting.findMany({
      take: HOT_POSTING_PAGE_SIZE,
      where: {
        isDelete: false,
        ...whereCondition,
        OR: [
          { isManualRestrict: false },
          { isAutoRestrict: true, isManualRestrict: false },
          { isAutoRestrict: false, isManualRestrict: null },
        ],
      },
      include: {
        memberPostingLikes: true,
        member: {
          select: {
            member_idx: true,
            member_code: true,
            profileImage: true,
          },
        },
        comments: { where: { isDelete: false } },
      },
      orderBy: [{ totalScore: 'desc' }, { createdAt: 'desc' }],
    });
  }
}

export type InsertPosting = {
  memberId: number;
  title: string;
  content: string;
  thumbs: string[];
};

export type UpdatePosting = {
  title?: string;
  content?: string;
  thumbs?: string[];
  commentScore?: number;
  likeScore?: number;
  hitScore?: number;
  hitCount?: number;
  totalScore?: number;
  isDelete?: boolean;
  isManualRestrict?: boolean;
  isAutoRestrict?: boolean;
};
