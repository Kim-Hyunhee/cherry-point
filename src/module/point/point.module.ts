import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { PointService } from './point.service';
import { MemberPointRepository } from './memberPoint.repository';
import { MemberModule } from 'src/module/member/member.module';

@Module({
  imports: [MemberModule],
  controllers: [PointController],
  providers: [PointService, MemberPointRepository],
  exports: [PointService],
})
export class PointModule {}
