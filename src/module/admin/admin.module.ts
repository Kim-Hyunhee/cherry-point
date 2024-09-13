import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PersonallyAdModule } from '../personally-ad/personally-ad.module';
import { AdminPersonallyAdController } from './admin.personally-ad.controller';
import { PostingModule } from '../posting/posting.module';
import { AdminReportController } from './admin.report.contoller';
import { CommentModule } from '../comment/comment.module';
import { AdminMemberController } from './admin.member.controller';
import { MemberModule } from '../member/member.module';
import { AuthModule } from '../auth/auth.module';
import { AdminRepository } from './admin.repository';
import { AdminPostingController } from './admin.hot-posting.controller';
import { AdminMeController } from './admin.me.controller';

@Module({
  providers: [AdminService, AdminRepository],
  controllers: [
    AdminPersonallyAdController,
    AdminController,
    AdminReportController,
    AdminMemberController,
    AdminPostingController,
    AdminMeController,
  ],
  imports: [
    PersonallyAdModule,
    PostingModule,
    CommentModule,
    forwardRef(() => MemberModule),
    forwardRef(() => AuthModule),
  ],
  exports: [AdminService],
})
export class AdminModule {}
