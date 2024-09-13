import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePointDto } from './dto';
import { MemberPointRepository } from './memberPoint.repository';
import { calculatePoint } from 'src/common/calculatePoint';
import { MemberService } from '../member/member.service';
import { PointCategories, PointInfo, getPointInfo } from 'src/common/constants';
import { Posting } from '@prisma/client';

@Injectable()
export class PointService {
  constructor(
    private memberPointRepository: MemberPointRepository,
    private memberService: MemberService,
  ) {}

  async createMemberPoint(data: CreatePointDto) {
    const { memberIdx, pointCategory, title, pointType, point } = data;
    const currentPoint = await this.memberService.readMemberPoint(
      data.memberIdx,
    );

    const result = await this.memberPointRepository.memberPointTransaction({
      member_idx: memberIdx,
      point_category: pointCategory,
      title,
      point_type: pointType,
      point,
      member_point: currentPoint + point,
    });

    return result;
  }

  // async createGreenp(
  //   data: CreateGreenpDto,
  //   memberPointDto: CreateMemberPointDto,
  // ) {
  //   const { memberIdx, adsIdx, adsReParticipate } = data;

  //   const param = {
  //     memberIdx,
  //     adsIdx,
  //     adsReParticipate,
  //   };

  //   const check = await this.greenpRepository.findGreenpPoint(param);

  //   if (check) {
  //     return false;
  //   }

  //   await this.greenpRepository.insertGreenpPoint(data);

  //   await this.createMemberPoint(memberPointDto);

  //   return true;
  // }

  async createHotPostingPoint({ hotPostings }: { hotPostings: Posting[] }) {
    const today = new Date();
    const options = { timeZone: 'Asia/Seoul' };
    const startDate = new Date(today.toLocaleString('en-US', options));
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(today.toLocaleString('en-US', options));
    endDate.setUTCHours(23, 59, 59, 999);

    await this.readManyMemberPoint({
      point_category: 'C12',
      startDate,
      endDate,
    });

    const limitedHotPostings = hotPostings.slice(0, 20);

    const postingPointMap = new Map();
    for (let index = 0; index < limitedHotPostings.length; index++) {
      const postingId = limitedHotPostings[index].id;
      // 등수에 따른 포인트 지급
      const point = calculatePoint({ index });

      const member = await this.memberService.readMember(
        limitedHotPostings[index].memberId,
      );

      let pointInfo: PointInfo = {
        pointCategory: PointCategories.hotPosting,
      };

      pointInfo = getPointInfo(pointInfo);

      await this.memberPointRepository.memberPointTransaction({
        member_idx: member.member_idx,
        point_category: pointInfo.pointCategory,
        title: pointInfo.title,
        point_type: pointInfo.pointType,
        point,
        member_point: member.member_point + point,
      });

      postingPointMap.set(postingId, point);
    }

    return postingPointMap;
  }

  async readManyMemberPoint({
    point_category,
    startDate,
    endDate,
  }: {
    point_category: string;
    startDate: Date;
    endDate: Date;
  }) {
    const memberPoints = await this.memberPointRepository.findManyMemberPoint({
      point_category,
      startDate,
      endDate,
    });
    if (memberPoints.length > 0) {
      throw new BadRequestException('이미 포인트를 받았습니다.');
    }

    return memberPoints;
  }

  async readPinMoneyMemberPoint({
    start,
    end,
    memberIds,
  }: {
    start: Date;
    end: Date;
    memberIds: number[];
  }) {
    return await this.memberPointRepository.findGroupedMemberPointForPinMoney({
      start,
      end,
      memberIds,
    });
  }

  async readPointLogWithCategory({
    memberId,
    start,
    category,
  }: {
    memberId: number;
    start: Date;
    category: string;
  }) {
    return await this.memberPointRepository.findMemberPointWithCategory({
      memberId,
      start,
      category,
    });
  }
}
