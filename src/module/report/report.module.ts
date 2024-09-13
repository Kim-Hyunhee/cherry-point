import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ReportRepository } from './report.repository';
import { PostingModule } from '../posting/posting.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  providers: [ReportService, ReportRepository],
  controllers: [ReportController],
  imports: [PostingModule, CommentModule],
})
export class ReportModule {}
