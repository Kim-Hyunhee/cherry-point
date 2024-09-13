import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './dto';
import * as bcrypt from 'bcrypt';
import { Admin, Advertiser } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken({
    memberId,
    adminId,
    advertiserId,
  }: {
    memberId?: number;
    adminId?: number;
    advertiserId?: number;
  }) {
    const payload: Payload = { member_idx: memberId, adminId, advertiserId };

    return this.jwtService.sign(payload);
  }

  async checkAdminPassword({
    admin,
    password,
  }: {
    admin: Admin;
    password: string;
  }) {
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      throw new BadRequestException('비밀번호 오류입니다.');
    }

    return isValid;
  }

  async checkAdPassword({
    advertiser,
    password,
  }: {
    advertiser: Advertiser;
    password: string;
  }) {
    const isValid = await bcrypt.compare(password, advertiser.password);

    if (!isValid) {
      throw new BadRequestException('비밀번호 오류입니다.');
    }

    return isValid;
  }
}
