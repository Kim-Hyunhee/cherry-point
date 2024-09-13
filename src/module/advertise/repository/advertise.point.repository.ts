import { Injectable } from '@nestjs/common';
import { AdType, Prisma } from '@prisma/client';
import { dateToSqlDateTime } from 'src/common/helper';
import { PAGE_SIZE } from 'src/common/pagination';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class AdvertisePointRepository {
  constructor(private prisma: PrismaService) {}

  async insertAdvertisePoint(data: InsertAdvertisePoint) {
    return await this.prisma.tbl_c_advertise.create({ data });
  }

  async findManyAdvertisePoint({
    memberId,
    advertiseIds,
    createdAt,
  }: {
    memberId?: number;
    advertiseIds?: number[];
    createdAt?: Date;
  }) {
    const advertisePoints = await this.prisma.tbl_c_advertise.findMany({
      where: {
        memberId,
        advertiseId: {
          in: advertiseIds,
        },
        createdAt: {
          gt: createdAt,
        },
      },
    });

    return advertisePoints.map((ad) => ad.advertiseId);
  }

  async findManyAdvertisePointByMemberIds({
    memberIds,
    advertiseIds,
    createdAt,
  }: {
    memberIds: number[];
    advertiseIds?: number[];
    createdAt?: Date;
  }) {
    const advertisePoints = await this.prisma.tbl_c_advertise.findMany({
      where: {
        memberId: {
          in: memberIds,
        },
        advertiseId: {
          in: advertiseIds,
        },
        createdAt: {
          gt: createdAt,
        },
      },
    });

    return advertisePoints.map((ad) => ad.advertiseId);
  }

  async findMemberAdpointLogs({
    page,
    advertiseIds,
  }: {
    page: number;
    advertiseIds: number[];
  }) {
    const skipAmount = (page - 1) * PAGE_SIZE;

    const sqlQuery = `
      SELECT
      *
      FROM tbl_c_advertise a
      LEFT JOIN (
        SELECT 
          b.member_idx,
          LEFT(b.member_code, 5) AS member_code,
          b.member_gender,
          FN_AES_DECRYPT(b.member_birth) AS member_birth,
          LEFT(FN_AES_DECRYPT(b.member_name), 1) AS member_name
        FROM tbl_member b
      ) m ON a.memberId = m.member_idx 
      WHERE a.advertiseId
      IN (${advertiseIds.map((id) => `${id}`).join(',')}) 
      ORDER BY a.createdAt DESC
      LIMIT ${PAGE_SIZE} OFFSET ${skipAmount}
    `;

    const adLogs = await this.prisma.$queryRaw(Prisma.sql([sqlQuery]));

    const total = await this.prisma.tbl_c_advertise.count({
      where: {
        advertiseId: {
          in: advertiseIds,
        },
      },
    });
    const currentPage = page;
    const lastPage = +Math.ceil(total / PAGE_SIZE);

    return { adLogs, total, currentPage, lastPage };
  }

  async findMemberAdpointLogForExcel({
    advertiseIds,
  }: {
    advertiseIds: number[];
  }) {
    const now = new Date().getFullYear();

    const sqlQuery = `
    SELECT
    m.member_code AS 'ID',
    m.member_gender AS '성별',
    CONCAT(TRUNCATE((${now} - m.member_age), -1), '대') AS '연령',
    m.member_name AS '이름',
    a.createdAt AS '완료 시각'
    FROM tbl_c_advertise a
    LEFT JOIN (
      SELECT 
        b.member_idx,
        CONCAT(SUBSTRING(b.member_code, 1, 5), '***') AS member_code,
        CASE
          WHEN b.member_gender = 0
          THEN '남성'
          ELSE '여성'
        END AS member_gender,
        CAST(LEFT(FN_AES_DECRYPT(b.member_birth), 4) AS unsigned) AS member_age,
        CASE
          WHEN LENGTH(FN_AES_DECRYPT(b.member_name)) = 6 
          THEN CONCAT(LEFT(FN_AES_DECRYPT(b.member_name), 1), '*')
          WHEN LENGTH(FN_AES_DECRYPT(b.member_name)) = 9 
          THEN CONCAT(LEFT(FN_AES_DECRYPT(b.member_name), 1), '**')
          ELSE CONCAT(LEFT(FN_AES_DECRYPT(b.member_name), 2), '**')
        END AS member_name
      FROM tbl_member b
    ) m ON a.memberId = m.member_idx 
    WHERE a.advertiseId
    IN (${advertiseIds.map((id) => `${id}`).join(',')}) 
    ORDER BY a.createdAt DESC
  `;

    const adLogs = await this.prisma.$queryRaw(Prisma.sql([sqlQuery]));

    return adLogs;
  }

  async findDailyAdLogs({
    page,
    advertiserId,
    startDate,
    endDate,
  }: {
    page: number;
    advertiserId?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const skipAmount = (page - 1) * PAGE_SIZE;

    let havingClause = ``;

    if (startDate) {
      havingClause += `HAVING date >= '${startDate}'`;
    }

    if (endDate) {
      if (startDate) {
        havingClause += ` AND`;
      } else {
        havingClause += `HAVING`;
      }
      havingClause += ` date <= '${endDate}'`;
    }

    let whereClause = ``;

    if (advertiserId) {
      whereClause += `WHERE advertiserId = ${advertiserId}`;
    }

    const sqlQuery = `
    SELECT
      date_format(DATE(createdAt), '%Y-%m-%d') as date,
      adType,
      COUNT(*) as _count
    FROM tbl_c_advertise 
    ${whereClause}
    GROUP BY DATE(createdAt), adType
    ${havingClause}
    ORDER BY date DESC
    `;

    const data = (await this.prisma.$queryRaw(
      Prisma.sql([sqlQuery]),
    )) as AdLogsRawData[];

    const results: AdLogsProcessedData[] = [];

    for (const item of data) {
      const { date, adType, _count } = item;

      let existingItem = results.find((item) => item.date === date);

      if (!existingItem) {
        existingItem = { date };
        results.push(existingItem);
      }

      if (adType === 'Quiz') {
        existingItem.quiz = Number(_count);
      } else {
        existingItem.save = Number(_count);
      }
    }

    const total = Object.keys(results).length;

    const currentPage = page;
    const lastPage = +Math.ceil(total / PAGE_SIZE);
    const endIndex = skipAmount + PAGE_SIZE;
    const paginatedData = results.slice(skipAmount, endIndex);

    return { total, currentPage, lastPage, logs: paginatedData };
  }

  async findRankLogs({
    formattedStart,
    formattedNow,
  }: {
    formattedStart?: string;
    formattedNow?: string;
  }) {
    const sqlQuery = `
    SELECT m.member_idx, m.member_code, SUM(a.point) AS point, COUNT(*) AS _count
    FROM tbl_member_point a
    LEFT JOIN (
      SELECT
        b.member_idx,
        LEFT(b.member_code, 3) AS member_code
      FROM tbl_member b
    ) m ON a.member_idx = m.member_idx
    WHERE a.ins_date >= '${formattedStart}' AND a.ins_date <= '${formattedNow}' AND a.point_category = 'C13'
    GROUP BY m.member_idx, m.member_code
    ORDER BY _count DESC
    LIMIT 10;
    `;

    // const sqlQuery = `
    // SELECT a.member_idx, SUM(a.point) AS point, COUNT(*) AS _count
    // FROM tbl_member_point a
    // WHERE a.ins_date >= '${formattedStart}' AND a.ins_date <= '${formattedNow}' AND a.point_category = 'C13'
    // GROUP BY a.member_idx
    // ORDER BY _count DESC
    // LIMIT 10;
    // `;

    const datas = (await this.prisma.$queryRaw(
      Prisma.sql([sqlQuery]),
    )) as AdRankRawData[];

    const results: ReturnAdRankLog[] = [];

    for (const data of datas) {
      results.push({
        memberId: data.member_idx,
        memberCode: data.member_code,
        point: data.point,
        count: Number(data._count),
      });
    }

    return results;
  }

  async findDailyPointSum() {
    const now = new Date();

    // const dateTime = '2024-08-23';
    const dateTime = dateToSqlDateTime(now);

    const sqlQuery = `
    SELECT advertiserId, SUM(point) AS point
    FROM tbl_c_advertise
    WHERE DATE(createdAt) = '${dateTime}'
    GROUP BY advertiserId;`;

    const data = await this.prisma.$queryRaw(Prisma.sql([sqlQuery]));

    return data;
  }
}

export type InsertAdvertisePoint = {
  memberId: number;
  advertiseId: number;
  advertiserId: number;
  adType: AdType;
  point: number;
};

export type ReturnAdRankLog = {
  memberId: number;
  memberCode: string;
  count: number;
  point: number;
};

export type AdRankRawData = {
  member_idx: number;
  member_code: string;
  point: number;
  _count: bigint;
};

export type AdLogsProcessedData = {
  date: string;
  quiz?: number;
  save?: number;
};

export type AdLogsRawData = {
  date: string;
  adType: string;
  _count: bigint;
};
