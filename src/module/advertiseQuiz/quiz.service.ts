import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { CreateAdQuizDto, CreateManyAdQuizDto } from './dto';

@Injectable()
export class QuizService {
  constructor(private repository: QuizRepository) {}

  async createAdQuiz({ quiz }: CreateAdQuizDto) {
    const adQuiz = await this.repository.findAdQuiz({ quiz });

    if (adQuiz) {
      throw new BadRequestException('중복된 퀴즈가 있습니다.');
    }

    return await this.repository.insertAdQuiz({ quiz });
  }

  async createManyAdQuiz(datas: CreateManyAdQuizDto) {
    const uniqueArr = Array.from(new Set(datas.quiz));

    if (uniqueArr.length !== datas.quiz.length) {
      throw new BadRequestException('중복된 퀴즈 값이 있습니다.');
    }

    for (const quiz of datas.quiz) {
      const adQuiz = await this.repository.findAdQuiz({ quiz });
      if (adQuiz) {
        throw new BadRequestException('이미 등록된 퀴즈입니다.');
      }
    }
    const result = await this.repository.insertManyAdQuiz(datas.quiz);

    return { message: `${result.count}개의 퀴즈를 등록하였습니다.` };
  }

  async readAdQuiz({ id, quiz }: { id?: number; quiz?: string }) {
    const adQuiz = await this.repository.findAdQuiz({ id, quiz });

    if (!adQuiz) {
      throw new NotFoundException('해당하는 미션 퀴즈를 찾을 수 없습니다.');
    }

    return adQuiz;
  }

  async readManyAdQuiz() {
    return await this.repository.findManyAdQuiz();
  }

  async updateAdQuiz({ id, quiz }: { id: number; quiz: string }) {
    const noQuiz = await this.repository.findAdQuiz({ id });

    if (!noQuiz) {
      throw new NotFoundException('해당하는 미션 퀴즈를 찾을 수 없습니다.');
    }

    const dupQuiz = await this.repository.findAdQuiz({ quiz });

    if (dupQuiz) {
      throw new BadRequestException('이미 등록된 퀴즈입니다.');
    }

    return await this.repository.updateAdQuiz({ id, quiz });
  }

  async deleteAdQuiz({ id }: { id: number }) {
    const quiz = await this.repository.findAdQuiz({ id });

    if (!quiz) {
      throw new NotFoundException('해당하는 광고를 찾을 수 없습니다.');
    }

    await this.repository.deleteAdQuiz({ id });
    return true;
  }
}
