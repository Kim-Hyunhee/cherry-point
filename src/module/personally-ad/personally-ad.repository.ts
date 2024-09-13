import { Injectable } from '@nestjs/common';
import { PAGE_SIZE } from 'src/common/pagination';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class PersonallyAdRepository {
  constructor(private prisma: PrismaService) {}

  async insertPersonallyAd(data: InsertPersonallyAd) {
    return await this.prisma.personallyAd.create({ data });
  }

  async findManyPersonallyAd({
    page,
    keyword,
  }: {
    page?: number;
    keyword?: string;
  }) {
    const skipAmount = page ? (page - 1) * PAGE_SIZE : 0;
    const takeAmount = page ? PAGE_SIZE : undefined;

    const or = keyword
      ? {
          OR: [
            { title: { contains: keyword as string } },
            { companyName: { contains: keyword as string } },
          ],
        }
      : {};

    const personallyAds = await this.prisma.personallyAd.findMany({
      skip: skipAmount,
      take: takeAmount,
      where: or,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.personallyAd.count({ where: or });
    const currentPage = page;
    const lastPage = +Math.ceil(total / PAGE_SIZE);

    return { personallyAds, total, currentPage, lastPage };
  }

  async findPersonallyAd(where: { id: number }) {
    return await this.prisma.personallyAd.findUnique({ where });
  }

  async updatePersonallyAd({
    where,
    data,
  }: {
    where: { id: number };
    data: UpdatePersonallyAd;
  }) {
    return await this.prisma.personallyAd.update({ where, data });
  }

  async deletePersonallyAd(where: { id: number }) {
    return await this.prisma.personallyAd.delete({ where });
  }
}

export type InsertPersonallyAd = {
  title: string;
  companyName: string;
  content: string;
  image: string[];
  aosLink: string;
  iosLink: string;
  deepLink: string;
};

export type UpdatePersonallyAd = {
  title?: string;
  companyName?: string;
  content?: string;
  image?: string[];
  aosLink?: string;
  iosLink?: string;
  deepLink?: string;
  isShow?: boolean;
};
