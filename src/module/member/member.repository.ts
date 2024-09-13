import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { UpdateMemberDto } from './dto';
import { localDate } from 'src/common/helper';
import { PAGE_SIZE } from 'src/common/pagination';
import { Prisma } from '@prisma/client';

@Injectable()
export class MemberRepository {
  constructor(private prisma: PrismaService) {}

  async findMemberInfo(memberIdx: number) {
    const user = await this.prisma.tbl_member.findFirst({
      where: { member_idx: memberIdx },
    });
    return user;
  }

  async findMemberUniqueKey({ memberId }: { memberId: number }) {
    const user = await this.prisma.tbl_member.findFirst({
      where: {
        member_idx: memberId,
      },
    });

    return user.unique_key;
  }

  async findMembersByUniqueKey({ uniqueKey }: { uniqueKey: string }) {
    return await this.prisma.tbl_member.findMany({
      where: {
        unique_key: uniqueKey,
      },
    });
  }

  async updateMemberInfo(memberIdx: number, data: UpdateMemberDto) {
    const { sumMemberPoint } = data;
    await this.prisma.tbl_member.update({
      where: { member_idx: memberIdx },
      data: { member_point: sumMemberPoint },
    });
  }

  async findMemberPoint(memberIdx: number) {
    const result = await this.prisma.tbl_member.findFirst({
      where: { member_idx: memberIdx },
      select: {
        member_point: true,
      },
    });
    return result.member_point;
  }

  async updateMemberPoint(memberIdx: number, sumPoint: number) {
    try {
      await this.prisma.tbl_member.update({
        where: { member_idx: memberIdx },
        data: { member_point: sumPoint, upd_date: localDate(new Date()) },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findManyMember({ page, code }: { page: number; code?: string }) {
    const skipAmount = (page - 1) * PAGE_SIZE;

    const or = code
      ? {
          OR: [{ member_code: code }],
        }
      : {};

    const members = await this.prisma.$queryRaw`SELECT member_idx, 
    FN_AES_DECRYPT(member_name) as member_name,
    member_code,
    ins_date,
    isSnsActive
    FROM tbl_member ${
      code ? Prisma.sql` WHERE member_code = ${code}` : Prisma.empty
    } 
    ORDER BY ins_date DESC
    LIMIT ${PAGE_SIZE}
    OFFSET ${skipAmount}`;

    const total = await this.prisma.tbl_member.count({
      where: or,
    });
    const currentPage = page;
    const lastPage = +Math.ceil(total / PAGE_SIZE);

    return { members, total, currentPage, lastPage };
  }

  async findMemberFCMToken(memberIds: number[]) {
    const aosResult = (await this.prisma.tbl_member.findMany({
      select: {
        gcm_key: true,
      },
      where: {
        member_idx: {
          in: memberIds,
        },
        device_os: 'A',
      },
    })) as GcmKeyRawData[];

    const iosResult = (await this.prisma.tbl_member.findMany({
      select: {
        gcm_key: true,
      },
      where: {
        member_idx: {
          in: memberIds,
        },
        device_os: 'I',
      },
    })) as GcmKeyRawData[];

    const aosTokens = aosResult.map((row) => row.gcm_key);
    const iosTokens = iosResult.map((row) => row.gcm_key);

    return { aosTokens, iosTokens };
  }

  async findMemberIdsWithFilter({
    page,
    data,
  }: {
    page: number;
    data: MemberFilter;
  }) {
    const skipAmount = (page - 1) * 500;

    let whereClause = `m.del_yn = 'N' AND m.all_alarm_yn = 'Y'`;

    if (data.memberCode) {
      whereClause += ` AND m.member_code = '${data.memberCode}'`;
    }

    if (data.age) {
      whereClause += ` AND TRUNCATE((date_format(now(), '%Y')-left(FN_AES_DECRYPT(m.member_birth), 4)+1),-1) = ${data.age}`;
    }

    if (data.gender == 0 || data.gender == 1) {
      whereClause += ` AND m.member_gender = ${data.gender}`;
    }

    if (data.cityCode) {
      whereClause += ` AND m.city_code = ${data.cityCode}`;
    }

    if (data.regionCode) {
      whereClause += ` AND m.region_code = ${data.regionCode}`;
    }

    if (data.insDateStart) {
      whereClause += ` AND m.ins_date >= '${data.insDateStart} 00:00:00'`;
    }

    if (data.insDateEnd) {
      whereClause += ` AND m.ins_date <= '${data.insDateEnd} 23:59:59'`;
    }

    if (data.loginDateStart) {
      whereClause += ` AND m.login_date >= '${data.loginDateStart} 00:00:00'`;
    }

    if (data.loginDateEnd) {
      whereClause += ` AND m.login_date <= '${data.loginDateEnd} 23:59:59'`;
    }

    const sqlQuery = `
    SELECT m.member_idx
    FROM tbl_member m
    WHERE ${whereClause}
    LIMIT ${500} OFFSET ${skipAmount}
    `;

    const countSqlQuery = `
    SELECT COUNT(*) as count
    FROM tbl_member m
    WHERE ${whereClause}
    `;

    const result = (await this.prisma.$queryRaw(
      Prisma.sql([sqlQuery]),
    )) as MemberIdsRawData[];
    const countResult = await this.prisma.$queryRaw(
      Prisma.sql([countSqlQuery]),
    );

    const memberIds = result.map((row) => row.member_idx);
    const total = Number(countResult[0].count);
    const currentPage = page;
    const lastPage = +Math.ceil(total / 500);

    return { memberIds, total, currentPage, lastPage };
  }

  async findCountWithFilter({ data }: { data: MemberFilter }) {
    let whereClause = `m.del_yn = 'N' AND m.all_alarm_yn = 'Y'`;

    if (data.memberCode) {
      whereClause += ` AND m.member_code = '${data.memberCode}'`;
    }

    if (data.age) {
      whereClause += ` AND TRUNCATE((date_format(now(), '%Y')-left(FN_AES_DECRYPT(m.member_birth), 4)+1),-1) = ${data.age}`;
    }

    if (data.gender == 0 || data.gender == 1) {
      whereClause += ` AND m.member_gender = ${data.gender}`;
    }

    if (data.cityCode) {
      whereClause += ` AND m.city_code = ${data.cityCode}`;
    }

    if (data.regionCode) {
      whereClause += ` AND m.region_code = ${data.regionCode}`;
    }

    if (data.insDateStart) {
      whereClause += ` AND m.ins_date >= '${data.insDateStart} 00:00:00'`;
    }

    if (data.insDateEnd) {
      whereClause += ` AND m.ins_date <= '${data.insDateEnd} 23:59:59'`;
    }

    if (data.loginDateStart) {
      whereClause += ` AND m.login_date >= '${data.loginDateStart} 00:00:00'`;
    }

    if (data.loginDateEnd) {
      whereClause += ` AND m.login_date <= '${data.loginDateEnd} 23:59:59'`;
    }

    const countSqlQuery = `
    SELECT COUNT(*) as count
    FROM tbl_member m
    WHERE ${whereClause}
    `;

    const countResult = await this.prisma.$queryRaw(
      Prisma.sql([countSqlQuery]),
    );

    const total = Number(countResult[0].count);

    return total;
  }

  async updateMember({
    where,
    data,
  }: {
    where: { member_idx: number };
    data: UpdateMember;
  }) {
    return await this.prisma.tbl_member.update({ where, data });
  }
}

type UpdateMember = {
  profileImage?: string;
  isSnsActive?: boolean;
};

type MemberFilter = {
  memberCode?: string;
  age?: number;
  gender?: number;
  cityCode?: number;
  regionCode?: number;
  insDateStart?: string;
  insDateEnd?: string;
  loginDateStart?: string;
  loginDateEnd?: string;
};

type MemberIdsRawData = {
  member_idx: number;
};

type GcmKeyRawData = {
  gcm_key: string;
};
