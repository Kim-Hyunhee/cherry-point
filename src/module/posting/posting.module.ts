import { Module, forwardRef } from '@nestjs/common';
import { PostingService } from './posting.service';
import { PostingController } from './posting.controller';
import { PostingRepository } from './posting.repository';
import { CommentModule } from '../comment/comment.module';
import { PostingScoreModule } from '../posting-score/posting-score.module';
import { HotPostingModule } from '../hot-posting/hot-posting.module';
import { PointModule } from 'src/module/point/point.module';

@Module({
  providers: [PostingService, PostingRepository],
  controllers: [PostingController],
  exports: [PostingService],
  imports: [
    forwardRef(() => CommentModule),
    forwardRef(() => PostingScoreModule),
    HotPostingModule,
    PointModule,
  ],
})
export class PostingModule {}
