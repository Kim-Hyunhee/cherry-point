import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberFilterDto, ModifyMemberProfileImageDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentMember } from 'src/decorators/currentMember.decorator';
import { tbl_member } from '@prisma/client';

@ApiTags('member')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('member')
export class MemberController {
  constructor(private service: MemberService) {}

  @Get('/me')
  async getMyInfo(@CurrentMember() member: tbl_member) {
    return await this.service.readMember(member.member_idx);
  }

  @Get('/memberCount')
  async getMemberIdsWithFilter(@Query() data: MemberFilterDto) {
    return await this.service.readMemberIdsWithFilter({ data });
  }

  @Get(':id')
  async getMemberInfo(@Param('id') id: number) {
    const user = this.service.readMember(id);
    return user;
  }

  @Patch('/profile-image')
  async patchMemberProfileImage(
    @Body() { profileImage }: ModifyMemberProfileImageDto,
    @CurrentMember() member: tbl_member,
  ) {
    return await this.service.modifyMemberProfileImage({
      memberId: member.member_idx,
      profileImage,
    });
  }
}
