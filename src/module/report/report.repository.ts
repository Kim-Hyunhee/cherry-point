import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class ReportRepository {
  constructor(private prisma: PrismaService) {}

  async insertPostingReport(data: InsertPostingReport) {
    return await this.prisma.postingReport.create({ data });
  }

  async insertCommentReport(data: InsertCommentReport) {
    return await this.prisma.commentReport.create({ data });
  }

  async findPostingReport(where: {
    memberId_postingId: { memberId: number; postingId: number };
  }) {
    return await this.prisma.postingReport.findUnique({ where });
  }

  async findCommentReport(where: {
    memberId_commentId: { memberId: number; commentId: number };
  }) {
    return await this.prisma.commentReport.findUnique({ where });
  }
}

export type InsertPostingReport = {
  memberId: number;
  postingId: number;
};

export type InsertCommentReport = {
  memberId: number;
  commentId: number;
};
