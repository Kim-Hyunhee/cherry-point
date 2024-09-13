import { BadRequestException, Injectable } from '@nestjs/common';
import { HotPostingRepository } from './hot-posting.repository';
import { Posting } from '@prisma/client';

@Injectable()
export class HotPostingService {
  constructor(private repository: HotPostingRepository) {}

  async createHotPosting({
    postingContent,
    savedDate,
  }: {
    postingContent: Posting[];
    savedDate: Date;
  }) {
    const hotPosting = await this.readTodayHotPosting({ today: savedDate });
    if (hotPosting) {
      throw new BadRequestException('이미 저장된 인기글 내역이 있습니다.');
    }

    return await this.repository.insertHotPosting({
      postingContent,
      savedDate,
    });
  }

  async readTodayHotPosting({ today }: { today: Date }) {
    const options = { timeZone: 'Asia/Seoul' };

    const startDate = new Date(today.toLocaleString('en-US', options));
    startDate.setUTCDate(startDate.getDate());
    startDate.setUTCHours(0, 0, 0, 0);

    return await this.repository.findTodayHotPosting({ today: startDate });
  }
}
