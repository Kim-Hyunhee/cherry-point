import { Module } from '@nestjs/common';
import { KeywordLabController } from './keywordLab.controller';
import { KeywordLabService } from './keywordLab.service';
import { KeywordLabRepository } from './keywordLab.repository';
import { SystemModule } from '../system/system.module';
import { MemberModule } from '../member/member.module';
import { PointModule } from '../point/point.module';
import { AdvertiseModule } from '../advertise/advertise.module';

@Module({
  providers: [KeywordLabService, KeywordLabRepository],
  controllers: [KeywordLabController],
  imports: [SystemModule, MemberModule, PointModule, AdvertiseModule],
  exports: [KeywordLabService],
})
export class KeywordLabModule {}
