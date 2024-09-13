import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlusCashService } from './plusCash.service';
import { CreatePlusCashLogDto } from './dto';

@ApiTags('plusCash')
@Controller('plusCash')
export class PlusCashController {
  constructor(private service: PlusCashService) {}

  @Post()
  @ApiOperation({ summary: '플러스캐시 POSTBACK' })
  async createPlusCashLog(@Body() data: CreatePlusCashLogDto) {
    return await this.service.createPlusCashlog(data);
  }
}
