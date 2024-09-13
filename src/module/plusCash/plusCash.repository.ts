import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type InsertPlusCashLog = {
  memberId: number;
  adType: string;
  point: number;
  uniqueKey: string;
  campaignName: string;
  campaignId: string;
  reward: number;
};

@Injectable()
export class PlusCashRepository {
  constructor(private prisma: PrismaService) {}

  async insertPlusCashLog(data: InsertPlusCashLog) {
    return await this.prisma.plusCashLogs.create({ data });
  }
}
