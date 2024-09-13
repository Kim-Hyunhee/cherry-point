import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegionRepository {
  constructor(private prisma: PrismaService) {}

  async findCities() {
    return await this.prisma.tbl_city.findMany({
      orderBy: {
        city_name: 'asc',
      },
    });
  }

  async findRegions({ cityCode }: { cityCode: number }) {
    return await this.prisma.tbl_region.findMany({
      where: {
        city_code: cityCode,
      },
      orderBy: {
        region_name: 'asc',
      },
    });
  }
}
