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
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdvertiseGuard } from '../auth/admin.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdvertiseService } from './advertise.service';
import { Payload } from '../auth/dto';
import {
  CreateAdPointDto,
  CreateAdvertiseDto,
  ModifyAdvertiseDto,
  ReadAdLogDto,
  ReadManyAdvertiseDto,
  ReadManyAdvertiseForExcelDto,
  ReadNextAdvertiseDto,
  DeleteManyAdvertiseDto,
  UploadFileDto,
  UpdateManyAdvertiseDto,
  ReadAdLogDashboardDto,
  ReadAdLogWithExcelDto,
  CreateManyAdvertiseDto,
} from './dto';
import { CurrentMember } from 'src/decorators/currentMember.decorator';
import * as XLSX from 'xlsx';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { JsonArray } from '@prisma/client/runtime/library';

@ApiTags('advertise')
@ApiBearerAuth('access-token')
@UseGuards(AdvertiseGuard)
@UseGuards(JwtAuthGuard)
@Controller('advertise')
export class AdvertiseController {
  constructor(private service: AdvertiseService) {}

  @Post()
  @ApiOperation({ summary: '광고 생성하기' })
  async postAdvertise(
    @CurrentMember() me: Payload,
    @Body() data: CreateAdvertiseDto,
  ) {
    if (me.advertiserId) {
      data.advertiserId = me.advertiserId;
    }

    return await this.service.createAdvertise(data);
  }

  @Post('excel')
  @ApiOperation({ summary: '엑셀 파일로 광고 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @UseInterceptors(FileInterceptor('file'))
  async postAdvertisesWithExcel(
    @CurrentMember() me: Payload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const advertiserId = me.advertiserId;

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(
      worksheet,
    ) as CreateManyAdvertiseDto[];

    const datas = jsonData.slice(2);

    await this.service.createManyAdvertise({
      advertiserId,
      datas,
    });

    return { message: '성공적으로 업로드 되었습니다!' };
  }

  @Post(':id')
  async postAdPoint(
    @CurrentMember() me: Payload,
    @Body() data: CreateAdPointDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const memberId = me.member_idx;

    if (!memberId) {
      return new UnauthorizedException();
    }

    return await this.service.createAdvertisePoint(memberId, id, data);
  }

  @Get('/all')
  @ApiOperation({ summary: '모든 광고 불러오기' })
  async getManyAdvertise(
    @Query() data: ReadManyAdvertiseDto,
    @CurrentMember() me: Payload,
  ) {
    if (me.advertiserId) {
      data.advertiserId = me.advertiserId;
    }

    return await this.service.readManyAdvertise(data);
  }

  @Get('/next')
  async getNextAdvertise(
    @Query() { skipAds }: ReadNextAdvertiseDto,
    @CurrentMember() me: Payload,
  ) {
    const memberId = me.member_idx;

    return await this.service.readNextAdvertise({ memberId, skipAds });
  }

  @Get('/history')
  async getTodayHistory(@CurrentMember() me: Payload) {
    const memberId = me.member_idx;

    return await this.service.readTodayHistory({ memberId });
  }

  @Get('/ranking')
  async getRanking() {
    return await this.service.readRanking();
  }

  @Get('/adLogs')
  @ApiOperation({ summary: '작업 로그 불러오기' })
  async getAdLogs(
    @Query() { page, adId }: ReadAdLogDto,
    @CurrentMember() me: Payload,
  ) {
    const advertiserId = me.advertiserId;

    return await this.service.readAdLogs({ page, adId, advertiserId });
  }

  @Get('/adLogs/excel/download')
  @ApiOperation({ summary: '작업 로그 일괄 다운로드' })
  async getAdLogsWithExcel(
    @Query() { adId }: ReadAdLogWithExcelDto,
    @CurrentMember() me: Payload,
    @Res() res: Response,
  ) {
    const advertiserId = me.advertiserId;

    const adLogs = (await this.service.readAdlogsWithExcel({
      adId,
      advertiserId,
    })) as JsonArray;

    const worksheet = XLSX.utils.json_to_sheet(adLogs);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });

    res.setHeader('Content-Disposition', 'attachment; filename=logs.xlsx');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(excelBuffer);
  }

  @Get('/excel/download')
  @ApiOperation({ summary: '엑셀 광고 목록 다운로드' })
  async getAdvertisesWithExcel(
    @Query() data: ReadManyAdvertiseForExcelDto,
    @CurrentMember() me: Payload,
    @Res() res: Response,
  ) {
    if (me.advertiserId) {
      data.advertiserId = me.advertiserId;
    }

    const ads = await this.service.readManyAdvertiseForExcel(data);

    const wb = XLSX.utils.book_new();

    const newWorksheet = XLSX.utils.json_to_sheet(ads);

    XLSX.utils.book_append_sheet(wb, newWorksheet, '광고목록');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=advertises.xlsx',
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }

  @Get('excel/upload')
  @ApiOperation({ summary: '업로드 양식 다운로드' })
  async getExcelForm(@CurrentMember() me: Payload, @Res() res: Response) {
    const filePath = me.adminId
      ? 'src/common/관리자 업데이트 파일.xlsx'
      : 'src/common/광고주 업데이트 파일.xlsx';

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=advertises.xlsx',
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Get('/admin/dashboard')
  @ApiOperation({ summary: '미션 달성 리포트' })
  async getAdminDashboard(@Query() data: ReadAdLogDashboardDto) {
    return await this.service.readTotalAdLogs(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'id별 광고 불러오기' })
  async getAdvertise(@Param('id', ParseIntPipe) id: number) {
    return await this.service.readAdvertise({ id });
  }

  @Patch('/many')
  @ApiOperation({ summary: '광고 일괄 활성화 변경' })
  async patchManyAdvertise(
    @Body() { adIds, isActive }: UpdateManyAdvertiseDto,
  ) {
    return await this.service.updateManyAdvertise({
      adIds,
      isActive,
    });
  }

  @Patch('/maxAchievement')
  async patchAllMaxAchievement() {
    return await this.service.updateAllMaxAchievement();
  }

  @Patch('/dailyPoint')
  @ApiOperation({ summary: '일일 광고주 포인트 차감하기' })
  async patchAdvertiserPointByDailyLog() {
    return await this.service.getDailyLogForDecreasePoint();
  }

  @Patch(':id')
  @ApiOperation({ summary: '광고 수정하기' })
  async patchAdvertise(
    @Param('id', ParseIntPipe) id: number,
    @CurrentMember() me: Payload,
    @Body() data: ModifyAdvertiseDto,
  ) {
    const advertiserId = me.advertiserId;

    return await this.service.updateAdvertise({ id, advertiserId, data });
  }

  @Delete('/many')
  @ApiOperation({ summary: '광고 일괄 삭제하기' })
  async DeleteManyAdvertiseDto(@Query() { adIds }: DeleteManyAdvertiseDto) {
    return await this.service.updateManyAdvertise({ adIds, isDelete: true });
  }

  @Delete(':id')
  @ApiOperation({ summary: '광고 삭제하기' })
  async deleteAdvertise(
    @Param('id', ParseIntPipe) id: number,
    @CurrentMember() me: Payload,
  ) {
    const advertiserId = me.advertiserId;

    return await this.service.deleteAdvertise({
      advertiseId: id,
      advertiserId,
    });
  }
}
