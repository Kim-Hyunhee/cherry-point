import { BadRequestException, Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { MemberFilterDto } from './dto';
import { dateToSqlDateTime } from 'src/common/helper';

@Injectable()
export class MemberService {
  constructor(private repository: MemberRepository) {}

  async readMember(memberIdx: number) {
    const user = await this.repository.findMemberInfo(memberIdx);

    if (!user) {
      throw new BadRequestException();
    }

    return user;
  }

  async readMemberPoint(memberIdx: number) {
    const point = await this.repository.findMemberPoint(memberIdx);
    return point;
  }

  async readMemberIdsWithFilter({
    page,
    data,
  }: {
    page?: number;
    data: MemberFilterDto;
  }) {
    let insDateStart = undefined;
    let insDateEnd = undefined;
    let loginDateStart = undefined;
    let loginDateEnd = undefined;

    if (data.insDateStart) {
      insDateStart = dateToSqlDateTime(new Date(data.insDateStart));
    }

    if (data.insDateEnd) {
      insDateEnd = dateToSqlDateTime(new Date(data.insDateEnd));
    }

    if (data.loginDateStart) {
      loginDateStart = dateToSqlDateTime(new Date(data.loginDateStart));
    }

    if (data.loginDateEnd) {
      loginDateEnd = dateToSqlDateTime(new Date(data.loginDateEnd));
    }

    if (page) {
      const memberIds = await this.repository.findMemberIdsWithFilter({
        page,
        data: {
          memberCode: data.memberCode,
          age: data.age,
          gender: data.gender,
          cityCode: data.cityCode,
          regionCode: data.regionCode,
          insDateStart,
          insDateEnd,
          loginDateStart,
          loginDateEnd,
        },
      });

      return memberIds;
    } else {
      const count = await this.repository.findCountWithFilter({
        data: {
          memberCode: data.memberCode,
          age: data.age,
          gender: data.gender,
          cityCode: data.cityCode,
          regionCode: data.regionCode,
          insDateStart,
          insDateEnd,
          loginDateStart,
          loginDateEnd,
        },
      });

      return count;
    }
  }

  async updateMemberPoint(memberIdx: number, sumPoint: number) {
    const result = await this.repository.updateMemberPoint(memberIdx, sumPoint);
    return result;
  }

  async readManyMember({ page, code }: { page: number; code?: string }) {
    return await this.repository.findManyMember({ page, code });
  }

  async readMemberFCMToken(memberIds: number[]) {
    return await this.repository.findMemberFCMToken(memberIds);
  }

  async modifyMemberProfileImage({
    memberId,
    profileImage,
  }: {
    memberId: number;
    profileImage: string;
  }) {
    await this.repository.updateMember({
      where: { member_idx: memberId },
      data: { profileImage },
    });

    return true;
  }

  async modifyMemberIsSnsActive({
    memberId,
    isSnsActive,
  }: {
    memberId: number;
    isSnsActive: boolean;
  }) {
    await this.readMember(memberId);

    await this.repository.updateMember({
      where: { member_idx: memberId },
      data: { isSnsActive },
    });

    return true;
  }

  async isValidMember({ memberId }: { memberId: number }): Promise<boolean> {
    const member = await this.repository.findMemberInfo(memberId);

    const validate = member.member_phone !== null;

    return validate;
  }

  async readMemberUniqueKey({ memberId }: { memberId: number }) {
    return await this.repository.findMemberUniqueKey({ memberId });
  }

  async readMemberIdsListByUniqueKey({
    memberUniqueKey,
  }: {
    memberUniqueKey: string;
  }) {
    const members = await this.repository.findMembersByUniqueKey({
      uniqueKey: memberUniqueKey,
    });

    const memberIds = members.map((member) => member.member_idx);
    return memberIds;
  }
}
