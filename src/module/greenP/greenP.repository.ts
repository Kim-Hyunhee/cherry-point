import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { localDate } from 'src/common/helper';

export type InsertGreenPLog = {
  memberId: number;
  adsId: number;
  adsName: string;
  adsReParticipate: string;
  reward: number;
};

@Injectable()
export class GreenPRepository {
  constructor(private prisma: PrismaService) {}

  async inseartGreenPLog(data: InsertGreenPLog) {
    return await this.prisma.tbl_c_greenp.create({
      data: {
        member_idx: data.memberId,
        ads_idx: data.adsId,
        ads_name: data.adsName,
        rwd_cost: data.reward,
        ads_re_participate: data.adsReParticipate,
        ins_date_time: localDate(new Date()),
        udps_date_time: localDate(new Date()),
      },
    });
  }
}
