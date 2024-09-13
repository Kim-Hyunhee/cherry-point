import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ModifyMemberIsSnsActiveDto, ReadManyMemberDto } from './dto';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('admin')
@ApiBearerAuth('access-token')
@UseGuards(AdminGuard)
@UseGuards(JwtAuthGuard)
@Controller('admin/member')
export class AdminMemberController {
  constructor(private memberService: MemberService) {}

  @Get()
  async getManyMember(@Query() query: ReadManyMemberDto) {
    return await this.memberService.readManyMember(query);
  }

  @Patch(':id/is-sns-active')
  async patchMemberIsSnsActive(
    @Param('id', ParseIntPipe) memberId: number,
    @Body() { isSnsActive }: ModifyMemberIsSnsActiveDto,
  ) {
    return await this.memberService.modifyMemberIsSnsActive({
      memberId,
      isSnsActive,
    });
  }
}
