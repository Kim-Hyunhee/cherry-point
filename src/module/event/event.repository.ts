import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PAGE_SIZE } from 'src/common/pagination';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventRepository {
  constructor(private prisma: PrismaService) {}

  async findEvents({ data }: { data: FindEventFilter }) {
    let whereClause = `WHERE del_yn = 'N'`;

    if (data.title) {
      whereClause += ` AND (e.title LIKE '%${data.title}%' OR e.contents LIKE '%${data.title}%')`;
    }

    if (data.subtitle) {
      whereClause += ` AND e.subtitle LIKE '%${data.subtitle}%'`;
    }

    if (data.state) {
      whereClause += ` AND e.state = '${data.state}'`;
    }

    if (data.startDateStart) {
      whereClause += ` AND DATE_FORMAT(e.start_date,'%Y-%m-%d') >= '${data.startDateStart}'`;
    }

    if (data.startDateEnd) {
      whereClause += ` AND DATE_FORMAT(e.start_date,'%Y-%m-%d') <= '${data.startDateEnd}'`;
    }

    if (data.endDateStart) {
      whereClause += ` AND DATE_FORMAT(e.end_date,'%Y-%m-%d') >= '${data.endDateStart}'`;
    }

    if (data.endDateEnd) {
      whereClause += ` AND DATE_FORMAT(e.end_date,'%Y-%m-%d') <= '${data.endDateEnd}'`;
    }

    if (data.insDateStart) {
      whereClause += ` AND DATE_FORMAT(e.ins_date,'%Y-%m-%d') >= '${data.insDateStart}'`;
    }

    if (data.insDateEnd) {
      whereClause += ` AND DATE_FORMAT(e.ins_date,'%Y-%m-%d') <= '${data.insDateEnd}'`;
    }

    const eventSql = `
    SELECT e.event_id, e.title
    FROM tbl_event e
    ${whereClause}
    ORDER BY e.title DESC`;

    const events = await this.prisma.$queryRaw(Prisma.sql([eventSql]));

    return events;
  }

  async findEventsWithPageNation({
    page,
    data,
  }: {
    page: number;
    data: FindEventFilter;
  }) {
    const skipAmount = (page - 1) * PAGE_SIZE;

    let whereClause = `WHERE e.del_yn = 'N'`;

    if (data.title) {
      whereClause += ` AND (e.title LIKE '%${data.title}%' OR e.contents LIKE '%${data.title}%')`;
    }

    if (data.subtitle) {
      whereClause += ` AND e.subtitle LIKE '%${data.subtitle}%'`;
    }

    if (data.state) {
      whereClause += ` AND e.state = '${data.state}'`;
    }

    if (data.startDateStart) {
      whereClause += ` AND DATE_FORMAT(e.start_date,'%Y-%m-%d') >= '${data.startDateStart}'`;
    }

    if (data.startDateEnd) {
      whereClause += ` AND DATE_FORMAT(e.start_date,'%Y-%m-%d') <= '${data.startDateEnd}'`;
    }

    if (data.endDateStart) {
      whereClause += ` AND DATE_FORMAT(e.end_date,'%Y-%m-%d') >= '${data.endDateStart}'`;
    }

    if (data.endDateEnd) {
      whereClause += ` AND DATE_FORMAT(e.end_date,'%Y-%m-%d') <= '${data.endDateEnd}'`;
    }

    if (data.insDateStart) {
      whereClause += ` AND DATE_FORMAT(e.ins_date,'%Y-%m-%d') >= '${data.insDateStart}'`;
    }

    if (data.insDateEnd) {
      whereClause += ` AND DATE_FORMAT(e.ins_date,'%Y-%m-%d') <= '${data.insDateEnd}'`;
    }

    const eventSql = `
    SELECT *
    FROM tbl_event e
    ${whereClause}
    ORDER BY e.event_idx DESC
    LIMIT ${PAGE_SIZE} OFFSET ${skipAmount}`;

    const totalSql = `
    SELECT COUNT(*) as count
    FROM tbl_event e
    ${whereClause}`;

    const events = await this.prisma.$queryRaw(Prisma.sql([eventSql]));
    const totalRaw = await this.prisma.$queryRaw(Prisma.sql([totalSql]));

    const total = Number(totalRaw[0].count);
    const lastPage = +Math.ceil(total / PAGE_SIZE);

    return { events, total, page, lastPage };
  }
}

export type CountRawData = {
  count: number;
};

export type FindEventFilter = {
  title?: string;
  subtitle?: string;
  state?: string;
  startDateStart?: string;
  startDateEnd?: string;
  endDateStart?: string;
  endDateEnd?: string;
  insDateStart?: string;
  insDateEnd?: string;
};
