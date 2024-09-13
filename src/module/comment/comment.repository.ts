import { Injectable } from '@nestjs/common';
import { PAGE_SIZE } from 'src/common/pagination';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class CommentRepository {
  constructor(private prisma: PrismaService) {}

  async insertComment(data: InsertComment) {
    return await this.prisma.comment.create({ data });
  }

  async findManyComment(where: {
    postingId: number;
    memberId?: number;
    isDelete?: boolean;
  }) {
    return await this.prisma.comment.findMany({
      where: { ...where, AND: { commentId: null } },
      include: {
        member: {
          select: { member_idx: true, member_code: true, profileImage: true },
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
          where: { isDelete: false },
        },
        reports: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findComment(where: { id: number }) {
    return await this.prisma.comment.findUnique({
      where,
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
        reports: true,
        posting: true,
      },
    });
  }

  async updateComment({
    where,
    data,
  }: {
    where: { id: number };
    data: UpdateComment;
  }) {
    return await this.prisma.comment.update({ where, data });
  }

  async findManyCommentReport({
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
    const skipAmount = (page - 1) * PAGE_SIZE;

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

    const comments = await this.prisma.comment.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: { member: { ...memberCondition }, ...whereCondition },
      include: {
        member: {
          select: {
            member_code: true,
          },
        },
        posting: {
          include: {
            member: {
              select: {
                member_idx: true,
                member_code: true,
                profileImage: true,
              },
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
        },
        reports: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.comment.count({
      where: { member: { ...memberCondition }, ...whereCondition },
    });
    const currentPage = page;
    const lastPage = +Math.ceil(total / PAGE_SIZE);

    return { comments, total, currentPage, lastPage };
  }

  async findCommentReport(where: { id: number }) {
    return await this.prisma.comment.findUnique({
      where: { reports: { some: {} }, ...where },
      include: {
        member: {
          select: {
            member_code: true,
          },
        },
        posting: true,
        reports: true,
      },
    });
  }
}

export type InsertComment = {
  memberId: number;
  postingId: number;
  content: string;
  commentId?: number;
};

export type UpdateComment = {
  content?: string;
  isDelete?: boolean;
  isAutoRestrict?: boolean;
  isManualRestrict?: boolean;
};
