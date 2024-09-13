import { Module } from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';

@Module({
  providers: [QuizRepository, QuizService],
  controllers: [QuizController],
  exports: [QuizService],
})
export class QuizModule {}
