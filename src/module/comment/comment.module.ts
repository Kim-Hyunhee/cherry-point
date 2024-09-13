import { Module, forwardRef } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { PostingModule } from '../posting/posting.module';
import { PostingScoreModule } from '../posting-score/posting-score.module';

@Module({
  providers: [CommentService, CommentRepository],
  controllers: [CommentController],
  imports: [forwardRef(() => PostingModule), PostingScoreModule],
  exports: [CommentService],
})
export class CommentModule {}
