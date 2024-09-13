import { Injectable } from '@nestjs/common';
import { PlusCashRepository } from './plusCash.repository';
import { CreatePlusCashLogDto } from './dto';
import { MemberService } from '../member/member.service';
import { getPointInfo, PointCategories, PointInfo } from 'src/common/constants';
import { PointService } from '../point/point.service';

@Injectable()
export class PlusCashService {
  constructor(
    private repository: PlusCashRepository,
    private memberService: MemberService,
    private pointService: PointService,
  ) {}

  async createPlusCashlog(data: CreatePlusCashLogDto) {
    try {
      const member = await this.memberService.readMember(Number(data.userId));

      const memberId = member.member_idx;

      await this.repository.insertPlusCashLog({
        memberId,
        adType: data.category,
        point: data.point,
        uniqueKey: data.unique_key,
        campaignName: data.campaign_name,
        campaignId: data.campaign_id,
        reward: data.reward,
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
        point: data.point,
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
