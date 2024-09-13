import { Module } from '@nestjs/common';
import { AdvertiseRepository } from './repository/advertise.repository';
import { AdvertiseService } from './advertise.service';
import { AdvertiseController } from './advertise.controller';
import { AdvertisePointRepository } from './repository/advertise.point.repository';
import { PointModule } from '../point/point.module';
import { AdvertiserModule } from '../advertiser/advertiser.module';
import { QuizModule } from '../advertiseQuiz/quiz.module';
import { SystemModule } from '../system/system.module';
import { MemberModule } from '../member/member.module';
import { SqsModule } from '../sqs/sqs.module';

@Module({
  providers: [AdvertiseRepository, AdvertiseService, AdvertisePointRepository],
  controllers: [AdvertiseController],
  imports: [
    PointModule,
    AdvertiserModule,
    QuizModule,
    SystemModule,
    MemberModule,
    SqsModule,
  ],
  exports: [AdvertiseService],
})
export class AdvertiseModule {}
