import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SendNotificationDto } from './dto';
import { MemberService } from 'src/module/member/member.service';
import { pushIndex } from 'src/common/constants';

@Injectable()
export class AdminNotificationService {
  constructor(
    @Inject('FIREBASE_ADMIN') private firebaseApp: admin.app.App,
    private memberService: MemberService,
  ) {}

  async sendNotification({ noti }: { noti: SendNotificationDto }) {
    const total = (await this.memberService.readMemberIdsWithFilter({
      data: {
        memberCode: noti.memberCode,
        age: noti.age,
        gender: noti.gender,
        cityCode: noti.cityCode,
        regionCode: noti.regionCode,
        insDateStart: noti.insDateStart,
        insDateEnd: noti.insDateEnd,
        loginDateStart: noti.loginDateStart,
        loginDateEnd: noti.loginDateEnd,
      },
    })) as number;

    const totalPage = +Math.ceil(total / 500);

    let page = 1;

    while (page != totalPage + 1) {
      type FilteredResult = {
        memberIds: number[];
        total: number;
        currentPage: number;
        lastPage: number;
      };

      const result = (await this.memberService.readMemberIdsWithFilter({
        page,
        data: {
          memberCode: noti.memberCode,
          age: noti.age,
          gender: noti.gender,
          cityCode: noti.cityCode,
          regionCode: noti.regionCode,
          insDateStart: noti.insDateStart,
          insDateEnd: noti.insDateEnd,
          loginDateStart: noti.loginDateStart,
          loginDateEnd: noti.loginDateEnd,
        },
      })) as FilteredResult;

      const { aosTokens, iosTokens } =
        await this.memberService.readMemberFCMToken(result.memberIds);

      if (total != 1) {
        const iosPayloads = {
          notification: {
            title: noti.title,
            body: noti.msg,
          },
          data: {
            index: noti.eventId ? pushIndex.eventPush : pushIndex.homePush,
            event_id: noti.eventId ? noti.eventId : '',
            title: noti.title,
            msg: noti.msg,
          },
          tokens: iosTokens,
        };

        const aosPayloads = {
          data: {
            index: noti.eventId ? pushIndex.eventPush : pushIndex.homePush,
            event_id: noti.eventId ? noti.eventId : '',
            title: noti.title,
            msg: noti.msg,
          },
          tokens: aosTokens,
        };

        const data = {
          index: noti.eventId ? pushIndex.eventPush : pushIndex.homePush,
          event_id: noti.eventId ? noti.eventId : '',
          title: noti.title,
          msg: noti.msg,
        };

        const notification = {
          title: noti.title,
          body: noti.msg,
        };

        const iosPayload = {
          token: iosTokens[0],
          data,
          notification,
        };

        const aosPayload = {
          token: aosTokens[0],
          data,
        };

        try {
          if (iosTokens.length > 1) {
            await admin.messaging().sendEachForMulticast(iosPayloads);
          } else if (iosTokens.length == 1) {
            await admin.messaging().send(iosPayload);
          }

          if (aosTokens.length > 1) {
            await admin.messaging().sendEachForMulticast(aosPayloads);
          } else if (aosTokens.length == 1) {
            await admin.messaging().send(aosPayload);
          }
        } catch (error) {
          console.error('Error sending messages:', error);
          throw error;
        }
      } else {
        const data = {
          index: noti.eventId ? pushIndex.eventPush : pushIndex.homePush,
          event_id: noti.eventId ? noti.eventId : '',
          title: noti.title,
          msg: noti.msg,
        };

        let notification = undefined;
        let token = '';

        if (iosTokens.length > 0) {
          notification = {
            title: noti.title,
            body: noti.msg,
          };
          token = iosTokens[0];
        } else {
          token = aosTokens[0];
        }

        const payload = {
          token,
          data,
          notification,
        };

        try {
          await admin.messaging().send(payload);
        } catch (error) {
          console.error('Error sending messages:', error);
          throw error;
        }
      }
      page++;
    }
  }
}
