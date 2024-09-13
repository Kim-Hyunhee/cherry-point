import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PAGE_SIZE } from 'src/common/pagination';
import { PointType, Prisma } from '@prisma/client';

@Injectable()
export class AdvertiserRepository {
  constructor(private prisma: PrismaService) {}

  async insertAdvertiser(data: InsertAdvertiser) {
    return await this.prisma.advertiser.create({ data });
  }

  async updateAdvertiser({
    where,
    data,
  }: {
    where: { id: number };
    data: UpdateAdvertiser;
  }) {
    return await this.prisma.advertiser.update({ where, data });
  }

  async findAdvertiser(where: WhereAdvertiser) {
    return await this.prisma.advertiser.findFirst({ where });
  }

  async findSimiliarAdvertiser({ searchWord }: { searchWord?: string }) {
    // const or =

    return await this.prisma.advertiser.findMany({
      select: {
        id: true,
        advertiserId: true,
        userName: true,
        point: true,
        trafficPrice: true,
        urlPrice: true,
      },
      where: {
        OR: [
          {
            advertiserId: {
              contains: searchWord,
            },
          },
          {
            userName: {
              contains: searchWord,
            },
          },
        ],
        isDelete: false,
      },
      take: 10,
    });
  }

  async findManyAdvertiser({
    page,
    advertiserId,
    userName,
    startDate,
    endDate,
  }: {
    page: number;
    advertiserId?: string;
    userName?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const skipAmount = (page - 1) * PAGE_SIZE;

    const advertiser = await this.prisma.advertiser.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: {
        advertiserId: {
          contains: advertiserId,
        },
        userName: {
          contains: userName,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        isDelete: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.advertiser.count({
      where: {
        advertiserId: {
          contains: advertiserId,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    const currentPage = page;
    const lastPage = +Math.ceil(total / PAGE_SIZE);

    return { advertiser, total, currentPage, lastPage };
  }

  async decreaseAdvertiserPoint({
    advertiserId,
    decreasePoint,
  }: {
    advertiserId: number;
    decreasePoint: number;
  }) {
    const sqlQuery = `
    SELECT GET_REDUCED_POINT(${advertiserId}, ${decreasePoint})
    `;

    await this.prisma.$queryRaw(Prisma.sql([sqlQuery]));

    return true;
  }

  async decreaseDailyAdvertiserPoint({ datas }: { datas: UpdateDailyPoint[] }) {
    const createAdPoints: CreateAdPoint[] = [];

    for (const data of datas) {
      // caseClause += `advertiserId = ${data.advertiserId}`;
      const sqlQuery = `SELECT GET_REDUCED_POINT(${data.advertiserId}, ${data.point})`;

      const result = await this.prisma.$queryRaw(Prisma.sql([sqlQuery]));

      createAdPoints.push({
        advertiserId: data.advertiserId,
        pointType: 'Decrease',
        point: data.point,
        currentPoint:
          result[0][`GET_REDUCED_POINT(${data.advertiserId}, ${data.point})`],
      });
    }

    return createAdPoints;
  }

  async deleteAdvertiser({ where }: { where: { id: number } }) {
    return await this.prisma.advertiser.delete({ where });
  }
}

export type InsertAdvertiser = {
  advertiserId: string;
  password: string;
  userName: string;
  trafficPrice: number;
  urlPrice: number;
};

export type UpdateAdvertiser = {
  password?: string;
  userName?: string;
  point?: number;
  trafficPrice?: number;
  urlPrice?: number;
  isdelete?: boolean;
};

export type WhereAdvertiser = {
  id?: number;
  advertiserId?: string;
  userName?: string;
};

export type UpdateDailyPoint = {
  advertiserId: number;
  point: number;
};

export type CreateAdPoint = {
  advertiserId: number;
  pointType: PointType;
  point: number;
  currentPoint: number;
};
