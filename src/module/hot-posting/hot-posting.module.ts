import { Module } from '@nestjs/common';
import { HotPostingService } from './hot-posting.service';
import { HotPostingRepository } from './hot-posting.repository';

@Module({
  providers: [HotPostingService, HotPostingRepository],
  exports: [HotPostingService],
})
export class HotPostingModule {}
