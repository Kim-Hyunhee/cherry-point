import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateMemberPointDto } from './dto';
import { localDate } from 'src/common/helper';

@Injectable()
export class MemberPointRepository {
  constructor(private prisma: PrismaService) {}

  async insertMemberPoint(dto: CreateMemberPointDto) {
    const point = await this.prisma.tbl_member_point.create({
      data: {
        member_idx: dto.memberIdx,
        point_category: dto.pointCategory,
        title: dto.title,
        point_type: dto.pointType,
        point: dto.point,
        member_point: dto.memberPoint,
        data: JSON.stringify(dto),
        ins_date: localDate(new Date()),
        upd_date: localDate(new Date()),
      },
    });

    return point;
  }

  async memberPointTransaction(data: InsertMemberPoint) {
    return await this.prisma.$transaction([
      this.prisma.tbl_member_point.create({
        data: {
          ...data,
          data: JSON.stringify(data),
          ins_date: localDate(new Date()),
          upd_date: localDate(new Date()),
        },
      }),
      this.prisma.tbl_member.update({
        where: { member_idx: data.member_idx },
        data: {
          member_point: data.member_point,
          upd_date: localDate(new Date()),
        },
      }),
    ]);
  }

  async findManyMemberPoint(where: {
    point_category: string;
    startDate: Date;
    endDate: Date;
  }) {
    const whereCondition = {
      ins_date: {
        gte: new Date(where.startDate),
        lte: new Date(where.endDate),
      },
    };

    return await this.prisma.tbl_member_point.findMany({
      where: { ...whereCondition, point_category: where.point_category },
    });
  }

  async findGroupedMemberPointForPinMoney({
    start,
    end,
    memberIds,
  }: {
    start: Date;
    end: Date;
    memberIds: number[];
  }) {
    const result = await this.prisma.tbl_member_point.groupBy({
      by: ['member_idx'],
      where: {
        ins_date: {
          gte: start,
          lte: end,
        },
        member_idx: {
          in: memberIds,
        },
        point_category: 'C13',
        point_type: 'I',
      },
      _sum: { point: true },
      _count: true,
      // _sum: {
      //   point: true,
      // },
    });

    return result;
  }

  async findMemberPointWithCategory({
    memberId,
    start,
    category,
  }: {
    memberId: number;
    start: Date;
    category: string;
  }) {
    const result = await this.prisma.tbl_member_point.findMany({
      where: {
        member_idx: memberId,
        ins_date: {
          gte: start,
        },
        point_category: category,
      },
    });

    return result;
  }
}

export type InsertMemberPoint = {
  member_idx: number;
  point_category: string;
  title: string;
  point_type: string;
  point: number;
  member_point: number;
};
