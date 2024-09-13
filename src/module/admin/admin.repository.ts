import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class AdminRepository {
  constructor(private prisma: PrismaService) {}

  async findAdmin(where: { id?: number; userName?: string }) {
    return await this.prisma.admin.findFirst({ where });
  }
}
