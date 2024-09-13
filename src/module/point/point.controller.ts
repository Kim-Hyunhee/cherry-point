import { Body, Controller, Post } from '@nestjs/common';
import { PointService } from './point.service';
import { CreateGreenpDto, CreateMemberPointDto } from './dto';
import { MemberService } from 'src/module/member/member.service';
import { PointCategories, PointInfo, getPointInfo } from 'src/common/constants';

@Controller('point')
export class PointController {
  constructor(
    private service: PointService,
    private memberService: MemberService,
  ) {}

  // @Post('/greenp')
  // async postGreenp(
  //   @Body()
  //   data: {
  //     memberIdx: string;
  //     adsIdx: number;
  //     adsName: string;
  //     rwdCost: number;
  //     adsReParticipate: string;
  //   },
  // ) {
  //   const { memberIdx, adsIdx, adsName, rwdCost, adsReParticipate } = data;
  //   const member = await this.memberService.readMember(parseInt(memberIdx));

  //   const greenpDto: CreateGreenpDto = {
  //     adsIdx,
  //     adsName,
  //     memberIdx: parseInt(memberIdx),
  //     rwdCost,
  //     adsReParticipate,
  //   };

  //   const sumPoint = member.member_point + data.rwdCost;

  //   let pointInfo: PointInfo = {
  //     pointCategory: PointCategories.greenp,
  //   };

  //   pointInfo = getPointInfo(pointInfo);

  //   const memberpointDto: CreateMemberPointDto = {
  //     memberIdx: parseInt(memberIdx),
  //     pointCategory: pointInfo.pointCategory,
  //     title: pointInfo.title,
  //     pointType: pointInfo.pointType,
  //     point: data.rwdCost,
  //     memberPoint: sumPoint,
  //   };

  //   const check = await this.service.createGreenp(greenpDto, memberpointDto);

  //   if (!check) {
  //     return false;
  //   }

  //   const result = await this.memberService.updateMemberPoint(
  //     parseInt(memberIdx),
  //     memberpointDto.memberPoint,
  //   );

  //   return result;
  // }
}
