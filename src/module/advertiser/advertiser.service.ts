import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdvertiserRepository } from './repositories/advertiser.repository';
import {
  CreateAdvertiserDto,
  ModifyAdvertiserDto,
  ModifyAdvertiserPointDto,
  ReadAdverTiserDto,
  ReadManyAdvertiserDto,
  ReadManyAdvertiserPointDto,
  ReadSimilarAdvertiserDto,
  UpdateDailyPoint,
} from './dto';
import * as bcrypt from 'bcrypt';
import { exclude } from 'src/common/helper';
import { AdvertiserPointRepository } from './repositories/advertiserPoint.repository';

@Injectable()
export class AdvertiserService {
  constructor(
    private repository: AdvertiserRepository,
    private pointRepository: AdvertiserPointRepository,
  ) {}

  async createAdvertiser(data: CreateAdvertiserDto) {
    const { advertiserId, userName, password } = data;

    const idCheck = await this.repository.findAdvertiser({
      advertiserId: advertiserId,
    });

    const nameCheck = await this.repository.findAdvertiser({ userName });

    if (idCheck || nameCheck) {
      throw new BadRequestException(
        '이미 해당 아이디/이름을 가진 광고주가 있습니다.',
      );
    }

    if (data.password.trim().length === 0) {
      throw new BadRequestException(
        '비밀번호는 공백이거나 공란일 수 없습니다.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    data.password = hashedPassword;

    return exclude(await this.repository.insertAdvertiser(data), ['password']);
  }

  async readAdvertiser(data: ReadAdverTiserDto) {
    const advertiser = await this.repository.findAdvertiser(data);

    if (!advertiser) {
      throw new NotFoundException('해당하는 광고주가 없습니다.');
    }

    return exclude(advertiser, ['password']);
  }

  async readSimiliarAdvertiser(data: ReadSimilarAdvertiserDto) {
    return await this.repository.findSimiliarAdvertiser(data);
  }

  async readAllAdvertiser(data: ReadManyAdvertiserDto) {
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
    const { advertiser, total, currentPage, lastPage } =
      await this.repository.findManyAdvertiser(data);
    const readOnly = advertiser.map((a) => exclude(a, ['password']));
    return { readOnly, total, currentPage, lastPage };
  }

  async readAdvertiserWithPw(data: ReadAdverTiserDto) {
    const advertiser = await this.repository.findAdvertiser(data);

    if (!advertiser) {
      throw new NotFoundException('해당하는 광고주가 없습니다.');
    }

    if (advertiser.isDelete) {
      throw new BadRequestException(
        '탈퇴한 계정입니다. 관리지에게 문의해주세요.',
      );
    }

    return advertiser;
  }

  async readManyAdvertiserPoint(data: ReadManyAdvertiserPointDto) {
    let advertiserId = data.advertiserId;

    if (data.userId) {
      const advertiser = await this.repository.findAdvertiser({
        advertiserId: data.userId,
      });

      if (!advertiser) {
        throw new NotFoundException('해당하는 광고주를 찾을 수 없습니다.');
      }

      advertiserId = advertiser.id;
    }

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

    return await this.pointRepository.findManyAdvertiserPoint({
      advertiserId,
      ...data,
    });
  }

  async updateAdvertiser({
    advertiserId,
    data,
  }: {
    advertiserId: number;
    data: ModifyAdvertiserDto;
  }) {
    const advertiser = await this.repository.findAdvertiser({
      id: advertiserId,
    });

    if (!advertiser) {
      throw new NotFoundException('해당하는 계정이 없습니다.');
    }

    if (data.password && data.password.trim().length === 0) {
      throw new BadRequestException(
        '비밀번호는 공백이거나 공란일 수 없습니다.',
      );
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    await this.repository.updateAdvertiser({
      where: { id: advertiserId },
      data,
    });

    return true;
  }

  async updateAdvertiserPoint({
    advertiserId,
    data,
  }: {
    advertiserId: number;
    data: ModifyAdvertiserPointDto;
  }) {
    const advertiser = await this.repository.findAdvertiser({
      id: advertiserId,
    });

    if (!advertiser) {
      throw new NotFoundException('해당하는 계정이 없습니다.');
    }

    const currentPoint = advertiser.point;
    const newPoint =
      data.type === 'Increase'
        ? currentPoint + data.point
        : currentPoint - data.point;

    await this.pointRepository.insertAdvertiserPoint({
      advertiserId,
      point: data.point,
      currentPoint: newPoint,
      pointType: data.type,
    });

    await this.repository.updateAdvertiser({
      where: { id: advertiserId },
      data: { point: newPoint },
    });

    return true;
  }

  async decreaseAdvertiserPoint({
    advertiserId,
    decreasePoint,
  }: {
    advertiserId: number;
    decreasePoint: number;
  }) {
    return await this.repository.decreaseAdvertiserPoint({
      advertiserId,
      decreasePoint,
    });
  }

  async decreaseDailyPoint(datas: UpdateDailyPoint[]) {
    const createAdPoints = await this.repository.decreaseDailyAdvertiserPoint({
      datas,
    });

    await this.pointRepository.insertManyAdvertiserPoint({
      datas: createAdPoints,
    });

    return true;
  }
}
