import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SystemService } from './system.service';
import { ModifySystemDto, ReadSystemDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentMember } from 'src/decorators/currentMember.decorator';
import { Payload } from '../auth/dto';

@ApiTags('system')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('system')
export class SystemController {
  constructor(private service: SystemService) {}

  @Get()
  @ApiOperation({ summary: '항목별 시스템 정보 가져오기' })
  async getSystemInfo(@Query() select: ReadSystemDto) {
    return await this.service.readSystemInfo(select);
  }

  @Patch()
  @ApiOperation({ summary: '시스템 정보 수정하기' })
  async patchSystemInfo(
    @CurrentMember() me: Payload,
    @Body() data: ModifySystemDto,
  ) {
    if (!me.adminId) {
      throw new UnauthorizedException('해당 api 접근 권한이 없습니다.');
    }

    return await this.service.updateSystemInfo(data);
  }
}
