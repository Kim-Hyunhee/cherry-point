import { Module } from '@nestjs/common';
import { MemberModule } from '../member/member.module';
import { PointModule } from '../point/point.module';
import { PlusCashRepository } from './plusCash.repository';
import { PlusCashService } from './plusCash.service';
import { PlusCashController } from './plusCash.controller';

@Module({
  providers: [PlusCashService, PlusCashRepository],
  controllers: [PlusCashController],
  imports: [MemberModule, PointModule],
  exports: [PlusCashService],
})
export class PlusCashModule {}
