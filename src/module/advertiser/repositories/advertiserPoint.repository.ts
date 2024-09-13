import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PointType } from '@prisma/client';
import { PAGE_SIZE } from 'src/common/pagination';

@Injectable()
export class AdvertiserPointRepository {
  constructor(private prisma: PrismaService) {}

  async insertAdvertiserPoint(data: InsertAdvertiserPoint) {
    return await this.prisma.advertiserPoint.create({ data });
  }

  async insertManyAdvertiserPoint({
    datas,
  }: {
    datas: InsertAdvertiserPoint[];
  }) {
    await this.prisma.advertiserPoint.createMany({
      data: datas,
    });

    return true;
  }

  async findManyAdvertiserPoint({
    page,
    advertiserId,
    userId,
    userName,
    startDate,
    endDate,
  }: {
    page: number;
    advertiserId?: number;
    userId?: string;
    userName?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const skipAmount = (page - 1) * PAGE_SIZE;

    const advertiserPoints = await this.prisma.advertiserPoint.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: {
        advertiserId,
        advertiser: {
          advertiserId: {
            contains: userId,
          },
          userName: {
            contains: userName,
          },
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        advertiser: {
          select: {
            advertiserId: true,
            userName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.advertiserPoint.count({
      where: {
        advertiserId,
        advertiser: {
          advertiserId: {
            contains: userId,
          },
          userName: {
            contains: userName,
          },
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const currentPage = page;
    const lastPage = +Math.ceil(total / PAGE_SIZE);

    return { advertiserPoints, total, currentPage, lastPage };
  }
}

export type InsertAdvertiserPoint = {
  advertiserId: number;
  pointType: PointType;
  point: number;
  currentPoint: number;
};
