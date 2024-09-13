import { BadRequestException, Injectable } from '@nestjs/common';
import {
  InsertPersonallyAd,
  PersonallyAdRepository,
} from './personally-ad.repository';

@Injectable()
export class PersonallyAdService {
  constructor(private repository: PersonallyAdRepository) {}

  async createPersonallyAd({
    title,
    companyName,
    content,
    image,
    aosLink,
    iosLink,
    deepLink,
  }: InsertPersonallyAd) {
    return await this.repository.insertPersonallyAd({
      title,
      companyName,
      content,
      image,
      aosLink,
      iosLink,
      deepLink,
    });
  }

  async readManyPersonallyAd({
    page,
    keyword,
  }: {
    page?: number;
    keyword?: string;
  }) {
    return await this.repository.findManyPersonallyAd({ page, keyword });
  }

  async readPersonallyAd({ personallyAdId }: { personallyAdId: number }) {
    const personallyAd = await this.repository.findPersonallyAd({
      id: personallyAdId,
    });
    if (!personallyAd) {
      throw new BadRequestException('해당 직광고가 존재하지 않습니다.');
    }

    return personallyAd;
  }

  async modifyPersonallyAd({
    personallyAdId,
    data,
  }: {
    personallyAdId: number;
    data: {
      title?: string;
      companyName?: string;
      content?: string;
      image?: string[];
      aosLink?: string;
      iosLink?: string;
      deepLink?: string;
    };
  }) {
    await this.readPersonallyAd({ personallyAdId });

    return await this.repository.updatePersonallyAd({
      where: { id: personallyAdId },
      data: { ...data },
    });
  }

  async modifyPersonallyAdIsShow({
    personallyAdId,
    isShow,
  }: {
    personallyAdId: number;
    isShow: boolean;
  }) {
    await this.readPersonallyAd({ personallyAdId });

    return await this.repository.updatePersonallyAd({
      where: { id: personallyAdId },
      data: { isShow },
    });
  }

  async removePersonallyAd({ personallyAdId }: { personallyAdId: number }) {
    await this.readPersonallyAd({ personallyAdId });

    return await this.repository.deletePersonallyAd({ id: personallyAdId });
  }
}
