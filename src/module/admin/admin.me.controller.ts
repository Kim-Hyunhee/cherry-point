import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CurrentMember } from 'src/decorators/currentMember.decorator';
import { Payload } from '../auth/dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { exclude } from 'src/common/helper';

@ApiTags('admin')
@ApiBearerAuth('access-token')
@UseGuards(AdminGuard)
@UseGuards(JwtAuthGuard)
@Controller('admin/me')
export class AdminMeController {
  constructor(private service: AdminService) {}

  @Get()
  @ApiOperation({ summary: '관리자 정보 가져오기' })
  async getAdmin(@CurrentMember() me: Payload) {
    const admin = await this.service.readAdmin({ adminId: me.adminId });
    const readOnly = exclude(admin, ['password']);

    return readOnly;
  }
}
