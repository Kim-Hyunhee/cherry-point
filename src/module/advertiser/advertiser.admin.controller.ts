import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdvertiserService } from './advertiser.service';
import {
  CreateAdvertiserDto,
  ModifyAdvertiserDto,
  ModifyAdvertiserPointDto,
  ReadAdvertiserIdDto,
  ReadManyAdvertiserDto,
  ReadManyAdvertiserPointDto,
  ReadSimilarAdvertiserDto,
} from './dto';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('advertiser')
@ApiBearerAuth('access-token')
@UseGuards(AdminGuard)
@UseGuards(JwtAuthGuard)
@Controller('advertiser/admin')
export class AdvertiserAdminController {
  constructor(private advertiserService: AdvertiserService) {}

  @Post()
  @ApiOperation({ summary: '광고주 생성' })
  async postAdvertiser(@Body() data: CreateAdvertiserDto) {
    return await this.advertiserService.createAdvertiser(data);
  }

  @Get('/all')
  @ApiOperation({ summary: '모든 광고주 가져오기' })
  async getAllAdvertiser(@Query() data: ReadManyAdvertiserDto) {
    return await this.advertiserService.readAllAdvertiser(data);
  }

  @Get()
  @ApiOperation({ summary: '광고주 ID로 광고주 가져오기' })
  async getAdvertiserWithId(@Query() data: ReadAdvertiserIdDto) {
    return await this.advertiserService.readAdvertiser(data);
  }

  @Get('/point/all')
  @ApiOperation({ summary: '광고주 포인트 로그' })
  async getAllAdvertiserPoint(@Query() data: ReadManyAdvertiserPointDto) {
    return await this.advertiserService.readManyAdvertiserPoint(data);
  }

  @Get('/search')
  @ApiOperation({ summary: '광고주계정 / 광고주명으로 광고주 찾기(유사)' })
  async getSimilarAdvertiser(@Query() data: ReadSimilarAdvertiserDto) {
    return await this.advertiserService.readSimiliarAdvertiser(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'id별 광고주 정보 가져오기' })
  async getAdvertiser(@Param('id', ParseIntPipe) id: number) {
    return await this.advertiserService.readAdvertiser({ id });
  }

  @Patch(':id')
  @ApiOperation({ summary: '광고주 정보 수정' })
  async patchAdvertiser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ModifyAdvertiserDto,
  ) {
    return await this.advertiserService.updateAdvertiser({
      advertiserId: id,
      data,
    });
  }

  @Patch('/point/:id')
  @ApiOperation({ summary: '광고주 포인트 증정 차감' })
  async patchAdvertiserPoint(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ModifyAdvertiserPointDto,
  ) {
    return await this.advertiserService.updateAdvertiserPoint({
      advertiserId: id,
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: '광고주 삭제하기' })
  async deleteAdvertiser(@Param('id', ParseIntPipe) id: number) {
    return await this.advertiserService.updateAdvertiser({
      advertiserId: id,
      data: {
        isDelete: true,
      },
    });
  }
}
