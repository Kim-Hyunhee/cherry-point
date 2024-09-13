import { Injectable } from '@nestjs/common';
import { KeywordLabRepository } from './keywordLab.repository';
import { CreateKeywordLabLogDto } from './dto';
import { SystemService } from '../system/system.service';
import { MemberService } from '../member/member.service';
import { getPointInfo, PointCategories, PointInfo } from 'src/common/constants';
import { PointService } from '../point/point.service';
import { AdvertiseService } from '../advertise/advertise.service';

@Injectable()
export class KeywordLabService {
  constructor(
    private repository: KeywordLabRepository,
    private systemService: SystemService,
    private memberService: MemberService,
    private pointService: PointService,
    private advertiseService: AdvertiseService,
  ) {}

  async createKeywordLabLog(data: CreateKeywordLabLogDto) {
    try {
      const systemInfo = await this.systemService.readSystemInfo({
        trafficReward: true,
        placeReward: true,
        bonusReward: true,
      });

      const member = await this.memberService.readMember(
        Number(data.media_user_key),
      );

      const memberId = member.member_idx;
      const history = await this.advertiseService.readTodayHistory({
        memberId,
      });

      const point =
        data.adType == 'Save'
          ? systemInfo.placeReward
          : systemInfo.trafficReward;

      await this.repository.insertKeywordLabLog({
        memberId,
        adType: data.adType,
        point,
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
        point: point,
      });

      let rewardPoint = point;

      if (history.length % 5 === 4) {
        let pointInfo: PointInfo = {
          pointCategory: PointCategories.pinMonetBonus,
        };

        pointInfo = getPointInfo(pointInfo);

        await this.pointService.createMemberPoint({
          memberIdx: memberId,
          pointCategory: pointInfo.pointCategory,
          title: pointInfo.title,
          pointType: pointInfo.pointType,
          point: systemInfo.bonusReward,
        });

        rewardPoint += systemInfo.bonusReward;
      }

      return {
        res: 'success',
        msg: '성공적으로 처리되었습니다.',
        rewardPoint: rewardPoint,
      };
    } catch (error) {
      return {
        res: 'fail',
        msg: error.message,
      };
    }
  }
}
