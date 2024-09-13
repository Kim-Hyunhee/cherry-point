import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KeywordLabRepository {
  constructor(private prisma: PrismaService) {}

  async insertKeywordLabLog(data: InsertKeywordLabLog) {
    return await this.prisma.keywordLabLogs.create({ data });
  }

  async findManyKeywordLabLog({
    memberId,
    createdAt,
  }: {
    memberId?: number;
    createdAt?: Date;
  }) {
    const advertisePoints = await this.prisma.keywordLabLogs.findMany({
      where: {
        memberId,
        createdAt: {
          gt: createdAt,
        },
      },
    });

    return advertisePoints.map((log) => log.id);
  }
}

export type InsertKeywordLabLog = {
  memberId: number;
  adType: string;
  point: number;
};
