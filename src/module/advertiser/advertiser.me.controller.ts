import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdvertiserService } from './advertiser.service';
import { CurrentMember } from 'src/decorators/currentMember.decorator';
import { Payload } from '../auth/dto';
import { ModifyAdvertiserSelfDto, ReadManyAdvertiserPointSelfDto } from './dto';
import { AdvertiseGuard } from '../auth/admin.guard';

@ApiTags('advertiser')
@ApiBearerAuth('access-token')
@UseGuards(AdvertiseGuard)
@UseGuards(JwtAuthGuard)
@Controller('advertiser/me')
export class AdvertiserMeController {
  constructor(private service: AdvertiserService) {}

  @Get()
  @ApiOperation({ summary: '광고주 자신 정보 가져오기' })
  async getMe(@CurrentMember() me: Payload) {
    const advertiser = await this.service.readAdvertiser({
      id: me.advertiserId,
    });
    return advertiser;
  }

  @Get('/point/all')
  @ApiOperation({ summary: '광고주 자신 포인트 로그' })
  async getAllAdvertiserPoint(
    @Query() data: ReadManyAdvertiserPointSelfDto,
    @CurrentMember() me: Payload,
  ) {
    data.advertiserId = me.advertiserId;
    return await this.service.readManyAdvertiserPoint(data);
  }

  @Patch()
  @ApiOperation({ summary: '광고주 내정보 수정' })
  async patchAdvertiser(
    @CurrentMember() me: Payload,
    @Body() data: ModifyAdvertiserSelfDto,
  ) {
    const advertiserId = me.advertiserId;

    return await this.service.updateAdvertiser({
      advertiserId,
      data,
    });
  }
}
