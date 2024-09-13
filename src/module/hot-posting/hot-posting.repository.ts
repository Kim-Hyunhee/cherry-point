import { Injectable } from '@nestjs/common';
import { Posting } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class HotPostingRepository {
  constructor(private prisma: PrismaService) {}

  async insertHotPosting(data: { postingContent: Posting[]; savedDate: Date }) {
    return await this.prisma.hotPosting.create({ data });
  }

  async findTodayHotPosting(where: { today: Date }) {
    return await this.prisma.hotPosting.findFirst({
      where: {
        savedDate: new Date(where.today),
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
