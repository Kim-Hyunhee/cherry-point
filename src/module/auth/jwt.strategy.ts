import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './dto';
import { MemberService } from '../member/member.service';
import { AdminService } from '../admin/admin.service';
import { AdvertiserService } from '../advertiser/advertiser.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private memberService: MemberService,
    private adminService: AdminService,
    private advertiserService: AdvertiserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: Payload) {
    if (payload.adminId) {
      await this.adminService.readAdmin({ adminId: payload.adminId });
    } else if (payload.member_idx) {
      await this.memberService.readMember(payload.member_idx);
    } else if (payload.advertiserId) {
      await this.advertiserService.readAdvertiserWithPw({
        id: payload.advertiserId,
      });
    }

    return {
      adminId: payload.adminId || null,
      member_idx: payload.member_idx || null,
      advertiserId: payload.advertiserId || null,
    };
  }
}
