import { Injectable } from '@nestjs/common';
import { GreenPRepository } from './greenP.repository';
import { CreateGreenPDto } from './dto';
import { MemberService } from '../member/member.service';
import { getPointInfo, PointCategories, PointInfo } from 'src/common/constants';
import { PointService } from '../point/point.service';

@Injectable()
export class GreenPService {
  constructor(
    private repository: GreenPRepository,
    private memberService: MemberService,
    private pointService: PointService,
  ) {}

  async createGreenPlog(data: CreateGreenPDto) {
    try {
      const member = await this.memberService.readMember(data.appUid);

      const memberId = member.member_idx;

      await this.repository.inseartGreenPLog({
        memberId,
        adsId: data.adsIdx,
        adsName: data.adsName,
        adsReParticipate: data.adsReParticipate,
        reward: 15,
      });

      let pointInfo: PointInfo = {
        pointCategory: PointCategories.pinMoney,
      };

      pointInfo = getPointInfo(pointInfo);

      await this.pointService.createMemberPoint({
        memberIdx: memberId,
        pointCategory: pointInfo.pointCategory,
        title: pointInfo.title,
        pointType: pointInfo.pointType,
        point: 15,
      });

      return {
        message: 'success',
        error: '',
      };
    } catch (error) {
      return {
        message: 'fail',
        error: error.message,
      };
    }
  }
}
