import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemRepository {
  constructor(private prisma: PrismaService) {}

  async findSystemInfo(select: SelectSystem) {
    return await this.prisma.system.findFirst({
      select,
    });
  }

  async updateSystemInfo({ id, data }: { id: number; data: UpdateSystem }) {
    return await this.prisma.system.update({
      where: {
        id,
      },
      data,
    });
  }
}

export type SelectSystem = {
  id: boolean;
  trafficReward?: boolean;
  placeReward?: boolean;
  bonusReward?: boolean;
  trafficInfoImg?: boolean;
  placeInfoImg?: boolean;
};

export type UpdateSystem = {
  trafficReward?: number;
  placeReward?: number;
  bonusReward?: number;
  trafficInfoImg?: string;
  placeInfoImg?: string;
};
