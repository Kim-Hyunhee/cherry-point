import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizRepository {
  constructor(private prisma: PrismaService) {}

  async insertAdQuiz(data: InsertAdQuiz) {
    return await this.prisma.advertiseQuiz.create({ data });
  }

  async insertManyAdQuiz(datas: string[]) {
    return await this.prisma.advertiseQuiz.createMany({
      data: datas.map((data) => ({
        quiz: data,
      })),
    });
  }

  async findAdQuiz({ id, quiz }: { id?: number; quiz?: string }) {
    return await this.prisma.advertiseQuiz.findFirst({
      where: {
        id,
        quiz,
      },
    });
  }

  async findManyAdQuiz() {
    return await this.prisma.advertiseQuiz.findMany();
  }

  async updateAdQuiz({ id, quiz }: { id: number; quiz: string }) {
    return await this.prisma.advertiseQuiz.update({
      where: { id },
      data: { quiz },
    });
  }

  async deleteAdQuiz({ id }: { id: number }) {
    await this.prisma.advertiseQuiz.delete({
      where: { id },
    });

    return true;
  }
}

export type InsertAdQuiz = {
  quiz: string;
};
