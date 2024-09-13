import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './module/prisma/prisma.module';
import { PointModule } from './module/point/point.module';
import { MemberModule } from './module/member/member.module';
import { PersonallyAdModule } from './module/personally-ad/personally-ad.module';
import { AdminModule } from './module/admin/admin.module';
import { UploadModule } from './module/upload/upload.module';
import { PostingModule } from './module/posting/posting.module';
import { CommentModule } from './module/comment/comment.module';
import { ReportModule } from './module/report/report.module';
import { AuthModule } from './module/auth/auth.module';
import { PostingScoreModule } from './module/posting-score/posting-score.module';
import { HotPostingModule } from './module/hot-posting/hot-posting.module';
import { AdvertiserModule } from './module/advertiser/advertiser.module';
import { AdvertiseModule } from './module/advertise/advertise.module';
import { QuizModule } from './module/advertiseQuiz/quiz.module';
import { SystemModule } from './module/system/system.module';
import { SqsModule } from './module/sqs/sqs.module';
import { KeywordLabModule } from './module/keywordLab/keywordLab.module';
import { AdminNotificationModule } from './module/admin/notification/admin.notification.module';
import { EventModule } from './module/event/event.module';
import { RegionModule } from './module/region/region.module';
import { PlusCashModule } from './module/plusCash/plusCash.module';
import { GreenPModule } from './module/greenP/greenP.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PointModule,
    MemberModule,
    PersonallyAdModule,
    AdminModule,
    UploadModule,
    PostingModule,
    CommentModule,
    ReportModule,
    AuthModule,
    PostingScoreModule,
    HotPostingModule,
    AdvertiserModule,
    AdvertiseModule,
    QuizModule,
    SystemModule,
    SqsModule,
    KeywordLabModule,
    AdminNotificationModule,
    EventModule,
    RegionModule,
    PlusCashModule,
    GreenPModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
