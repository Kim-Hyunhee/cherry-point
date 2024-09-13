import { Module, forwardRef } from '@nestjs/common';
import { PostingScoreService } from './posting-score.service';
import { PostingModule } from '../posting/posting.module';

@Module({
  providers: [PostingScoreService],
  imports: [forwardRef(() => PostingModule)],
  exports: [PostingScoreService],
})
export class PostingScoreModule {}
