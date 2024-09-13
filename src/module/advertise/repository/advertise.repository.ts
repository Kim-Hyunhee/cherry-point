import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdType, Prisma } from '@prisma/client';
import { PAGE_SIZE } from 'src/common/pagination';
import { dateToSqlDateTime, localDate } from 'src/common/helper';

@Injectable()
export class AdvertiseRepository {
  constructor(private prisma: PrismaService) {}

  async insertAdvertise(data: InsertAdvertise) {
    return await this.prisma.advertise.create({ data });
  }

  async insertManyAdvertises(datas: InsertAdvertise[]) {
    await this.prisma.advertise.createMany({
      data: datas.map((data) => ({
        advertiserId: data.advertiserId,
        adType: data.adType,
        startDate: data.startDate,
        endDate: data.endDate,
        adCategory: data.adCategory,
        adName: data.adName,
        adKeyword: data.adKeyword,
        adQuiz: data.adQuiz,
        adAnswer: data.adAnswer,
        placeUrl: data.placeUrl,
        dailyRequest: data.dailyRequest,
        isMaxAchievement: data.isMaxAchievement,
      })),
    });

    return true;
  }

  async findAdvertise(where: { id: number }) {
    return await this.prisma.advertise.findFirst({ where });
  }

  async findSaveAdvertise() {
    const ads = await this.prisma.advertise.findMany({
      where: {
        adType: 'Save',
        endDate: {
          gt: localDate(new Date()),
        },
        isActive: true,
        isDelete: false,
      },
    });

    return ads.map((ad) => ad.id);
  }

  async findQuizAdvertise() {
    const ads = await this.prisma.advertise.findMany({
      where: {
        adType: 'Quiz',
        endDate: {
          gt: localDate(new Date()),
        },
        isActive: true,
        isDelete: false,
      },
    });

    return ads.map((ad) => ad.id);
  }

  async findManyAdForLogs({ advertiserId }: { advertiserId?: number }) {
    const ads = await this.prisma.advertise.findMany({
      where: advertiserId ? { advertiserId: advertiserId } : {},
    });

    return ads.map((ad) => ad.id);
  }

  async findManyAdvertises({
    page,
    advertiserId,
    adName,
    adType,
    startDate,
    endDate,
    isActive,
    adCategory,
  }: {
    page: number;
    advertiserId?: number;
    adName?: string;
    adType?: AdType;
    startDate?: Date;
    endDate?: Date;
    isActive?: boolean;
    adCategory?: string;
  }) {
    const skipAmount = (page - 1) * PAGE_SIZE;

    const or =
      startDate && endDate
        ? {
            OR: [
              { startDate: { gte: startDate } },
              { endDate: { lte: endDate } },
            ],
          }
        : {};

    const now = new Date();

    const options = { timeZone: 'Asia/Seoul' };

    const todayStart = new Date(now.toLocaleString('en-US', options));

    const todayEnd = new Date(now.toLocaleString('en-US', options));

    let whereClause = 'a.isDelete = 0';

    if (advertiserId) {
      whereClause += `
      AND a.advertiserId = ${advertiserId}`;
    }

    if (startDate) {
      const startDateStr = dateToSqlDateTime(startDate);
      whereClause += `
      AND a.startDate >= '${startDateStr} 00:00:00'`;
    }

    if (endDate) {
      const endDateStr = dateToSqlDateTime(endDate);
      whereClause += `
      AND a.endDate <= '${endDateStr} 23:59:59'`;
    }

    if (adName) {
      whereClause += `
      AND a.adName LIKE '%${adName}%'`;
    }

    if (adType) {
      whereClause += `
      AND a.adType = '${adType}'`;
    }

    if (isActive != undefined) {
      whereClause += `
      AND a.isActive = ${isActive}`;
    }

    if (adCategory) {
      whereClause += `
      AND a.adCategory LIKE CONCAT('%${adCategory}%')`;
    }

    const todayStartDateStr = dateToSqlDateTime(todayStart);
    const todayEndDateStr = dateToSqlDateTime(todayEnd);

    const sqlQuery = `SELECT 
    a.*, 
    (SELECT COUNT(*)
     FROM tbl_c_advertise 
     WHERE tbl_c_advertise.advertiseId = a.id 
     AND tbl_c_advertise.createdAt >= '${todayStartDateStr} 00:00:00' 
     AND tbl_c_advertise.createdAt <= '${todayEndDateStr} 23:59:59') AS _count
FROM 
    Advertise AS a
WHERE 
    ${whereClause}
ORDER BY 
    a.createdAt DESC
LIMIT ${PAGE_SIZE} OFFSET ${skipAmount}`;

    const rawData = (await this.prisma.$queryRaw(
      Prisma.sql([sqlQuery]),
    )) as AdvertiseRawData[];

    const advertises: AdvertiseResponse[] = [];

    for (const advertise of rawData) {
      advertises.push({
        id: advertise.id,
        advertiserId: advertise.advertiserId,
        adType: advertise.adType,
        startDate: advertise.startDate,
        endDate: advertise.endDate,
        isActive: advertise.isActive === 1,
        adCategory: advertise.adCategory,
        adName: advertise.adName,
        adKeyword: advertise.adKeyword,
        adQuiz: advertise.adQuiz,
        adAnswer: advertise.adAnswer,
        placeUrl: advertise.placeUrl,
        dailyRequest: advertise.dailyRequest,
        isMaxAchievement: advertise.isMaxAchievement === 1,
        isDelete: advertise.isDelete === 1,
        createdAt: advertise.createdAt,
        updatedAt: advertise.updatedAt,
        _count: {
          tbl_c_advertise: Number(advertise._count),
        },
      });
    }

    const total = await this.prisma.advertise.count({
      where: {
        adName: {
          contains: adName,
        },
        adType,
        startDate: {
          gte: startDate,
        },
        endDate: {
          lte: endDate,
        },
        isActive,
        adCategory: {
          contains: adCategory,
        },
        isDelete: false,
        advertiserId,
        AND: or,
      },
    });
    const currentPage = page;
    const lastPage = +Math.ceil(total / PAGE_SIZE);

    return { total, currentPage, lastPage, advertises };
  }

  async findManyAdvertisesForExcel({
    advertiserId,
    adName,
    adType,
    startDate,
    endDate,
    isActive,
    adCategory,
  }: {
    advertiserId?: number;
    adName?: string;
    adType?: AdType;
    startDate?: Date;
    endDate?: Date;
    isActive?: boolean;
    adCategory?: string;
  }) {
    const or =
      startDate && endDate
        ? {
            OR: [
              { startDate: { gte: startDate } },
              { endDate: { lte: endDate } },
            ],
          }
        : {};

    const select = advertiserId
      ? {
          id: true,
          adType: true,
          startDate: true,
          endDate: true,
          isActive: true,
          adCategory: true,
          adName: true,
          adKeyword: true,
          adQuiz: true,
          adAnswer: true,
          placeUrl: true,
          dailyRequest: true,
        }
      : {
          id: true,
          advertiserId: true,
          adType: true,
          startDate: true,
          endDate: true,
          isActive: true,
          adCategory: true,
          adName: true,
          adKeyword: true,
          adQuiz: true,
          adAnswer: true,
          placeUrl: true,
          dailyRequest: true,
        };

    const advertises = await this.prisma.advertise.findMany({
      select,
      where: {
        adName: {
          contains: adName,
        },
        adType,
        startDate: {
          gte: startDate,
        },
        endDate: {
          lte: endDate,
        },
        isActive,
        adCategory: {
          contains: adCategory,
        },
        advertiserId,
        isDelete: false,
        AND: or,
      },
      orderBy: { createdAt: 'asc' },
    });

    return advertises;
  }

  async findNextAdvertise({ excludeIds }: { excludeIds: number[] }) {
    return await this.prisma.advertise.findMany({
      where: {
        id: {
          notIn: excludeIds,
        },
        advertiser: {
          point: {
            gte: 100,
          },
          isDelete: false,
        },
        startDate: {
          lte: localDate(new Date()),
        },
        endDate: {
          gte: localDate(new Date()),
        },
        isMaxAchievement: false,
        isDelete: false,
        isActive: true,
      },
    });
  }

  async updateAdvertise({
    where,
    data,
  }: {
    where: { id: number };
    data: UpdateAdvertise;
  }) {
    return await this.prisma.advertise.update({ where, data });
  }

  async updateManyAdvertise({
    adIds,
    isActive,
    isDelete,
  }: {
    adIds: number[];
    isActive?: boolean;
    isDelete?: boolean;
  }) {
    await this.prisma.advertise.updateMany({
      where: {
        id: {
          in: adIds,
        },
      },
      data: {
        isActive,
        isDelete,
      },
    });
  }

  async updateAllMaxAchievement() {
    await this.prisma.advertise.updateMany({
      data: {
        isMaxAchievement: false,
      },
    });
  }
}

export type InsertAdvertise = {
  advertiserId: number;
  adType: AdType;
  startDate: Date;
  endDate: Date;
  adCategory?: string;
  adName: string;
  adKeyword: string;
  adQuiz?: string;
  adAnswer?: string;
  placeUrl?: string;
  dailyRequest: number;
  isMaxAchievement: boolean;
};

export type UpdateAdvertise = {
  adType?: AdType;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  adCategory?: string;
  adName?: string;
  adKeyword?: string;
  adquiz?: string;
  adAnswer?: string;
  placeUrl?: string;
  dailyRequest?: number;
  isDelete?: boolean;
  isMaxAchievement?: boolean;
};

export type AdvertiseRawData = {
  id: number;
  advertiserId: number;
  adType: string;
  startDate: string;
  endDate: string;
  isActive: number;
  adCategory: string;
  adName: string;
  adKeyword: string;
  adQuiz: string;
  adAnswer: string;
  placeUrl: string;
  dailyRequest: number;
  isMaxAchievement: number;
  isDelete: number;
  createdAt: string;
  updatedAt: string;
  _count: bigint;
};

export type AdvertiseResponse = {
  id: number;
  advertiserId: number;
  adType: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  adCategory: string | null;
  adName: string;
  adKeyword: string;
  adQuiz: string;
  adAnswer: string;
  placeUrl: string;
  dailyRequest: number;
  isMaxAchievement: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    tbl_c_advertise: number;
  };
};
