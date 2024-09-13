import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdvertiseRepository } from './repository/advertise.repository';
import {
  CreateAdPointDto,
  CreateAdvertiseDto,
  CreateManyAdvertiseDto,
  ModifyAdvertiseDto,
  ReadAdvertiseDto,
  ReadManyAdvertiseDto,
  ReadManyAdvertiseForExcelDto,
} from './dto';
import { AdvertisePointRepository } from './repository/advertise.point.repository';
import { PointService } from '../point/point.service';
import { PointCategories, PointInfo, getPointInfo } from 'src/common/constants';
import { AdvertiserService } from '../advertiser/advertiser.service';
import {
  dateToSqlDateTime,
  excelDateToJSDate,
  exclude,
  getFinalUrl,
} from 'src/common/helper';
import { QuizService } from '../advertiseQuiz/quiz.service';
import { SystemService } from '../system/system.service';
import { MemberService } from '../member/member.service';
import { SqsService } from '../sqs/sqs.service';
import { UpdateDailyPoint } from '../advertiser/dto';

@Injectable()
export class AdvertiseService {
  constructor(
    private repository: AdvertiseRepository,
    private pointRepository: AdvertisePointRepository,
    private pointService: PointService,
    private advertiserService: AdvertiserService,
    private quizService: QuizService,
    private systemService: SystemService,
    private memberService: MemberService,
    private sqsService: SqsService,
  ) {}

  async createAdvertise(data: CreateAdvertiseDto) {
    const adType = data.adType;

    if (!data.dailyRequest) {
      throw new BadRequestException('일작업 요청량을 작성해주세요.');
    }

    if (adType === 'Quiz') {
      if (!data.adAnswer) {
        throw new BadRequestException('퀴즈의 정답을 작성해주세요.');
      }

      // 추후 미션 값 증가되면 삭제되는 부분
      const adQuiz = '플레이스 클릭 후 주변 탭 내의 [명소] 1번째 장소는?';
      data.adQuiz = adQuiz;

      const validate = await this.quizService.readAdQuiz({ quiz: data.adQuiz });
      if (!validate) {
        throw new BadRequestException('해당하는 미션 퀴즈 값이 없습니다.');
      }

      data.adAnswer = data.adAnswer.trim();
    } else {
      if (!data.placeUrl) {
        throw new BadRequestException('정답 URL을 작성해주세요.');
      }

      data.placeUrl = data.placeUrl.trim();
    }

    const options = { timeZone: 'Asia/Seoul' };

    const startDateTime = new Date(
      data.startDate.toLocaleString('en-US', options),
    );
    startDateTime.setUTCHours(0, 0, 0, 0);

    const endDateTime = new Date(data.endDate.toLocaleString('en-US', options));
    endDateTime.setUTCHours(23, 59, 59, 999);

    const today = new Date();
    today.setUTCHours(23, 59, 59, 999);

    data.isMaxAchievement = startDateTime >= today ? true : false;

    data.startDate = startDateTime;
    data.endDate = endDateTime;

    return await this.repository.insertAdvertise(data);
  }

  async createManyAdvertise({
    advertiserId,
    datas,
  }: {
    advertiserId?: number;
    datas: CreateManyAdvertiseDto[];
  }) {
    const params: CreateAdvertiseDto[] = [];

    const promises = datas.map(async (data, index) => {
      if (!data.dailyRequest) {
        throw new BadRequestException(
          `${index}행의 일작업 요청량을 작성해주세요.`,
        );
      }

      if (data.adType === 'Quiz') {
        if (!data.adAnswer) {
          throw new BadRequestException(
            `${index}행의 퀴즈의 정답을 작성해주세요.`,
          );
        }

        const adQuiz = '플레이스 클릭 후 주변 탭 내의 [명소] 1번째 장소는?';
        data.adQuiz = adQuiz;

        const validate = await this.quizService.readAdQuiz({
          quiz: data.adQuiz,
        });
        if (!validate) {
          throw new BadRequestException(
            `${index}행의 해당하는 미션 퀴즈 값이 없습니다.`,
          );
        }

        data.adAnswer = data.adAnswer.toString().trim();
      } else if (data.adType === 'Save') {
        if (!data.placeUrl) {
          throw new BadRequestException(
            `${index}행의 정답 URL을 작성해주세요.`,
          );
        }

        data.placeUrl = data.placeUrl.toString().trim();
      } else {
        throw new BadRequestException(
          `${index}행의 adType을 작성해주세요. 작성된 adType: ${data.adType}`,
        );
      }
      const start = excelDateToJSDate(data.startDate);
      const end = excelDateToJSDate(data.endDate);

      // start.setHours(0, 0, 0, 0);
      // end.setHours(23, 59, 59, 999);

      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      data.startDate = start;
      data.endDate = end;

      data.adKeyword = data.adKeyword.toString().trim();

      if (data.adCategory) {
        data.adCategory = data.adCategory.toString().trim();
      }

      if (!advertiserId) {
        const advertiser = await this.advertiserService.readAdvertiser({
          advertiserId: data.advertiserId,
        });

        advertiserId = advertiser.id;
      }

      // advertises.push(data);

      const today = new Date();
      today.setUTCHours(23, 59, 59, 999);

      const isMaxAchievement = start >= today ? true : false;

      params.push({
        advertiserId,
        adType: data.adType,
        startDate: data.startDate,
        endDate: data.endDate,
        adCategory: data.adCategory,
        adName: data.adName,
        adQuiz: data.adQuiz,
        adKeyword: data.adKeyword,
        adAnswer: data.adAnswer,
        placeUrl: data.placeUrl,
        dailyRequest: data.dailyRequest,
        isMaxAchievement,
      });
    });

    await Promise.all(promises);

    await this.repository.insertManyAdvertises(params);

    return true;
  }

  async createAdvertisePoint(
    memberId: number,
    adId: number,
    data: CreateAdPointDto,
  ) {
    const validate = await this.memberService.isValidMember({ memberId });

    if (!validate) {
      //  본인 인증 안된 멤버찾기
      throw new BadRequestException();
    }

    const advertise = await this.repository.findAdvertise({ id: adId });

    if (!advertise) {
      throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
    }

    // if (advertise.isDelete || !advertise.isActive) {
    //   throw new BadRequestException('종료된 이벤트입니다.');
    // }

    const advertiser = await this.advertiserService.readAdvertiser({
      id: advertise.advertiserId,
    });

    const history = await this.readTodayHistory({ memberId });

    const { trafficReward, placeReward, bonusReward } =
      await this.systemService.readSystemInfo({
        trafficReward: true,
        placeReward: true,
        bonusReward: true,
      });

    const now = new Date();

    const options = { timeZone: 'Asia/Seoul' };

    const dateTime = new Date(now.toLocaleString('en-US', options));
    dateTime.setUTCDate(dateTime.getDate());
    dateTime.setUTCHours(0, 0, 0, 0);

    if (advertise.adType === 'Quiz') {
      // 퀴즈인경우

      const attendHistory = await this.pointRepository.findManyAdvertisePoint({
        memberId,
        advertiseIds: [adId],
        createdAt: dateTime,
      });

      if (attendHistory.length !== 0) {
        throw new BadRequestException('이미 참가한 이벤트입니다.');
      }

      if (!data.adAnswer) {
        throw new BadRequestException('퀴즈의 정답을 기입해주세요.');
      }

      if (advertise.adAnswer !== data.adAnswer.trim()) {
        throw new BadRequestException('퀴즈의 정답이 올바르지 않습니다.');
      }

      await this.pointRepository.insertAdvertisePoint({
        memberId,
        advertiseId: advertise.id,
        advertiserId: advertise.advertiserId,
        adType: advertise.adType,
        point: advertiser.trafficPrice,
      });

      const achievement = await this.pointRepository.findManyAdvertisePoint({
        advertiseIds: [adId],
        createdAt: dateTime,
      });

      if (achievement.length >= advertise.dailyRequest) {
        await this.repository.updateAdvertise({
          where: { id: adId },
          data: {
            isMaxAchievement: true,
          },
        });
      }

      let pointInfo: PointInfo = {
        pointCategory: PointCategories.pinMoney,
      };

      pointInfo = getPointInfo(pointInfo);

      await this.pointService.createMemberPoint({
        memberIdx: memberId,
        pointCategory: pointInfo.pointCategory,
        title: pointInfo.title,
        pointType: pointInfo.pointType,
        point: trafficReward,
      });

      //  여기서 메시지 발송
      await this.sqsService.sendAdvertiserPointDecreaseMessageToAwsSqs(
        advertiser.id,
        advertiser.trafficPrice,
      );
    }

    if (advertise.adType === 'Save') {
      //  플레이스 저장인 경우

      const attendHistory = await this.pointRepository.findManyAdvertisePoint({
        memberId,
        advertiseIds: [adId],
      });

      if (attendHistory.length !== 0) {
        throw new BadRequestException('이미 참가한 이벤트입니다.');
      }

      if (!data.adAnswer) {
        throw new BadRequestException('플레이스 URL을 기록해주세요.');
      }

      const urlString = await getFinalUrl(data.adAnswer.trim());

      const url = new URL(urlString);

      const urlParam = url.searchParams.get('url');

      const decodedUrl =
        urlParam === null ? urlString : decodeURIComponent(urlParam);

      if (advertise.placeUrl !== decodedUrl) {
        throw new BadRequestException('플레이스 URL이 올바르지 않습니다.');
      }

      await this.pointRepository.insertAdvertisePoint({
        memberId,
        advertiseId: advertise.id,
        advertiserId: advertise.advertiserId,
        adType: advertise.adType,
        point: advertiser.urlPrice,
      });

      const achievement = await this.pointRepository.findManyAdvertisePoint({
        advertiseIds: [adId],
        createdAt: dateTime,
      });

      if (achievement.length >= advertise.dailyRequest) {
        await this.repository.updateAdvertise({
          where: { id: adId },
          data: {
            isMaxAchievement: true,
          },
        });
      }

      let pointInfo: PointInfo = {
        pointCategory: PointCategories.pinMoney,
      };

      pointInfo = getPointInfo(pointInfo);

      await this.pointService.createMemberPoint({
        memberIdx: memberId,
        pointCategory: pointInfo.pointCategory,
        title: pointInfo.title,
        pointType: pointInfo.pointType,
        point: placeReward,
      });

      //  메세지 큐에 전달
      await this.sqsService.sendAdvertiserPointDecreaseMessageToAwsSqs(
        advertiser.id,
        advertiser.urlPrice,
      );
    }

    let rewardPoint = advertise.adType === 'Quiz' ? trafficReward : placeReward;

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
        point: bonusReward,
      });

      rewardPoint += bonusReward;
    }

    return { rewardPoint };
  }

  async readAdvertise(where: ReadAdvertiseDto) {
    const advertise = await this.repository.findAdvertise(where);

    if (!advertise) {
      throw new NotFoundException('해당하는 광고가 없습니다.');
    }

    return advertise;
  }

  async readManyAdvertiseForExcel(data: ReadManyAdvertiseForExcelDto) {
    const options = { timeZone: 'Asia/Seoul' };

    if (data.startDate) {
      const startDateTime = new Date(
        data.startDate.toLocaleString('en-US', options),
      );
      startDateTime.setUTCHours(0, 0, 0, 0);

      data.startDate = startDateTime;
    }

    if (data.endDate) {
      const endDateTime = new Date(
        data.endDate.toLocaleString('en-US', options),
      );
      endDateTime.setUTCHours(23, 59, 59, 999);

      data.endDate = endDateTime;
    }

    return await this.repository.findManyAdvertisesForExcel(data);
  }

  async readManyAdvertise(data: ReadManyAdvertiseDto) {
    const options = { timeZone: 'Asia/Seoul' };

    if (data.startDate) {
      const startDateTime = new Date(
        data.startDate.toLocaleString('en-US', options),
      );
      startDateTime.setUTCHours(0, 0, 0, 0);

      data.startDate = startDateTime;
    }

    if (data.endDate) {
      const endDateTime = new Date(
        data.endDate.toLocaleString('en-US', options),
      );
      endDateTime.setUTCHours(23, 59, 59, 999);

      data.endDate = endDateTime;
    }

    return await this.repository.findManyAdvertises(data);
  }

  async readNextAdvertise({
    memberId,
    skipAds,
  }: {
    memberId: number;
    skipAds?: number[];
  }) {
    const quizIds = await this.repository.findQuizAdvertise();
    const saveIds = await this.repository.findSaveAdvertise();

    const now = new Date();

    const options = { timeZone: 'Asia/Seoul' };

    const dateTime = new Date(now.toLocaleString('en-US', options));
    dateTime.setUTCDate(dateTime.getDate() - 4);
    dateTime.setUTCHours(0, 0, 0, 0);

    const memberUniqueKey = await this.memberService.readMemberUniqueKey({
      memberId,
    });

    const memberIds = await this.memberService.readMemberIdsListByUniqueKey({
      memberUniqueKey,
    });

    const attendedQuizAds =
      await this.pointRepository.findManyAdvertisePointByMemberIds({
        memberIds,
        advertiseIds: quizIds,
        createdAt: dateTime,
      });

    const attendedSaveAds =
      await this.pointRepository.findManyAdvertisePointByMemberIds({
        memberIds,
        advertiseIds: saveIds,
      });

    const attendedAds = attendedQuizAds.concat(attendedSaveAds);

    let excludeIds: number[];

    if (skipAds !== undefined) {
      excludeIds = attendedAds.concat(skipAds);
    } else {
      excludeIds = attendedAds;
    }

    const ads = await this.repository.findNextAdvertise({ excludeIds });

    if (ads.length === 0) {
      throw new NotFoundException('모든 광고가 소진되었습니다.');
    }

    const randomNum = Math.floor(Math.random() * ads.length);

    const nextAd = exclude(ads[randomNum], ['adAnswer', 'placeUrl']);

    return nextAd;
  }

  async readTodayHistoryGroupAdId({ memberId }: { memberId: number }) {
    const now = new Date();

    const options = { timeZone: 'Asia/Seoul' };

    const dateTime = new Date(now.toLocaleString('en-US', options));
    dateTime.setUTCDate(dateTime.getDate());
    dateTime.setUTCHours(0, 0, 0, 0);

    return await this.pointRepository.findManyAdvertisePoint({
      memberId,
      createdAt: dateTime,
    });
  }

  async readTodayHistory({ memberId }: { memberId: number }) {
    const now = new Date();

    const options = { timeZone: 'Asia/Seoul' };

    const dateTime = new Date(now.toLocaleString('en-US', options));
    dateTime.setUTCDate(dateTime.getDate());
    dateTime.setUTCHours(0, 0, 0, 0);

    const category = 'C13';

    const results = await this.pointService.readPointLogWithCategory({
      memberId,
      start: dateTime,
      category,
    });

    return results.map((result) => result.point);
  }

  async readRanking() {
    const utcNow = new Date();

    const options = { timeZone: 'Asia/Seoul' };

    const start = new Date(utcNow.toLocaleString('en-US', options));
    start.setUTCDate(start.getDate());
    start.setUTCHours(0, 0, 0, 0);

    const now = new Date(utcNow.toLocaleString('en-US', options));
    now.setUTCDate(now.getDate());
    now.setUTCHours(now.getHours(), now.getMinutes(), 0, 0);

    const formattedStart = start.toISOString().slice(0, 19).replace('T', ' ');
    const formattedNow = now.toISOString().slice(0, 19).replace('T', ' ');

    const datas = await this.pointRepository.findRankLogs({
      formattedStart,
      formattedNow,
    });

    // for (const data of datas) {
    //   const memberCode = (await this.memberService.readMember(data.memberId))
    //     .member_code;

    //   data.memberCode = memberCode.slice(0, 3);
    // }

    return datas;
  }

  async readAdLogs({
    page,
    adId,
    advertiserId,
  }: {
    page: number;
    adId?: number;
    advertiserId?: number;
  }) {
    const ads = this.repository.findManyAdForLogs({ advertiserId });

    if (adId) {
      if (!(await ads).includes(adId)) {
        throw new BadRequestException('광고 id를 잘못설정하였습니다.');
      }
    }

    const adIds = !adId
      ? await this.repository.findManyAdForLogs({ advertiserId })
      : [adId];

    return await this.pointRepository.findMemberAdpointLogs({
      page,
      advertiseIds: adIds,
    });
  }

  async readAdlogsWithExcel({
    adId,
    advertiserId,
  }: {
    adId?: number;
    advertiserId?: number;
  }) {
    const ads = this.repository.findManyAdForLogs({ advertiserId });

    if (adId) {
      if (!(await ads).includes(adId)) {
        throw new BadRequestException('광고 id를 잘못설정하였습니다.');
      }
    }

    const adIds = !adId
      ? await this.repository.findManyAdForLogs({ advertiserId })
      : [adId];

    return await this.pointRepository.findMemberAdpointLogForExcel({
      advertiseIds: adIds,
    });
  }

  async readTotalAdLogs({
    page,
    userId,
    startDate,
    endDate,
  }: {
    page: number;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    let advertiserId: number;

    if (userId) {
      const advertiser = await this.advertiserService.readAdvertiser({
        advertiserId: userId,
      });

      advertiserId = advertiser.id;
    }

    const options = { timeZone: 'Asia/Seoul' };

    let startDateTime: string;
    let endDateTime: string;

    if (startDate) {
      startDateTime = dateToSqlDateTime(
        new Date(startDate.toLocaleString('en-US', options)),
      );
      // startDateTime.setUTCHours(0, 0, 0, 0);

      // startDate = dateToSqlDateTime(startDateTime);
    }

    if (endDate) {
      endDateTime = dateToSqlDateTime(
        new Date(endDate.toLocaleString('en-US', options)),
      );
      // endDateTime.setUTCHours(23, 59, 59, 999);

      // endDate = endDateTime;
    }

    return await this.pointRepository.findDailyAdLogs({
      page,
      advertiserId,
      startDate: startDateTime,
      endDate: endDateTime,
    });
  }

  async updateAdvertise({
    id,
    advertiserId,
    data,
  }: {
    id: number;
    advertiserId?: number;
    data: ModifyAdvertiseDto;
  }) {
    const advertise = await this.repository.findAdvertise({
      id,
    });

    if (!advertise) {
      throw new NotFoundException('해당 광고가 없습니다.');
    }

    if (advertiserId) {
      if (advertise.advertiserId !== advertiserId) {
        throw new UnauthorizedException('수정 권한이 없습니다.');
      }
    }

    const adType = data.adType;

    if (adType) {
      if (adType === 'Quiz') {
        if (!data.adAnswer && !advertise.adAnswer) {
          throw new BadRequestException('퀴즈의 정답을 작성해주세요.');
        }
      } else {
        if (!data.placeUrl && !advertise.placeUrl) {
          throw new BadRequestException('정답 URL을 작성해주세요.');
        }
      }
    }

    const advertiseIds = [];

    advertiseIds.push(advertise.id);

    const now = new Date();

    const options = { timeZone: 'Asia/Seoul' };

    const dateTime = new Date(now.toLocaleString('en-US', options));
    dateTime.setUTCDate(dateTime.getDate());
    dateTime.setUTCHours(0, 0, 0, 0);

    const history = await this.pointRepository.findManyAdvertisePoint({
      advertiseIds,
      createdAt: dateTime,
    });

    if (data.dailyRequest) {
      if (data.dailyRequest > history.length) {
        data.isMaxAchievement = false;
      } else {
        data.isMaxAchievement = true;
      }
    }

    if (data.startDate) {
      const startDateTime = new Date(
        data.startDate.toLocaleString('en-US', options),
      );
      startDateTime.setUTCHours(0, 0, 0, 0);
      data.startDate = startDateTime;
    }

    if (data.endDate) {
      const endDateTime = new Date(
        data.endDate.toLocaleString('en-US', options),
      );
      endDateTime.setUTCHours(23, 59, 59, 999);

      data.endDate = endDateTime;
    }

    return await this.repository.updateAdvertise({ where: { id }, data });
  }

  async updateManyAdvertise({
    adIds,
    isActive,
    isDelete,
  }: {
    adIds: number[];
    isActive?: boolean;
    isDelete?: boolean;
  }) {
    for (const adId of adIds) {
      const ad = await this.repository.findAdvertise({ id: adId });
      if (!ad) {
        throw new NotFoundException(
          `${adId}에 해당하는 광고를 찾을 수 없습니다.`,
        );
      }
    }

    await this.repository.updateManyAdvertise({
      adIds,
      isActive,
      isDelete,
    });

    return true;
  }

  async updateAllMaxAchievement() {
    await this.repository.updateAllMaxAchievement();

    return true;
  }

  async deleteAdvertise({
    advertiseId,
    advertiserId,
  }: {
    advertiseId: number;
    advertiserId?: number;
  }) {
    const advertise = await this.repository.findAdvertise({
      id: advertiseId,
    });

    if (!advertise) {
      throw new NotFoundException('해당 광고가 없습니다.');
    }

    if (advertiserId) {
      if (advertise.advertiserId !== advertiserId) {
        throw new UnauthorizedException('삭제 권한이 없습니다.');
      }
    }

    return await this.repository.updateAdvertise({
      where: { id: advertiseId },
      data: { isDelete: true },
    });
  }

  async getDailyLogForDecreasePoint() {
    const pointData =
      (await this.pointRepository.findDailyPointSum()) as UpdateDailyPoint[];

    if (pointData.length === 0) {
      throw new BadRequestException('미션 기록이 없습니다.');
    }

    return await this.advertiserService.decreaseDailyPoint(pointData);
  }
}
