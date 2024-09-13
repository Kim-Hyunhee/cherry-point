import { Module } from '@nestjs/common';
import { MemberModule } from '../member/member.module';
import { PointModule } from '../point/point.module';
import { GreenPRepository } from './greenP.repository';
import { GreenPService } from './greenP.service';
import { GreenPController } from './greenP.controller';

@Module({
  providers: [GreenPRepository, GreenPService],
  controllers: [GreenPController],
  imports: [MemberModule, PointModule],
})
export class GreenPModule {}
