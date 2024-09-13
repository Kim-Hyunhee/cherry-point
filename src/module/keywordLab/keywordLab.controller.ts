import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { KeywordLabService } from './keywordLab.service';
import { CreateKeywordLabLogDto } from './dto';

@ApiTags('keywordLab')
@Controller('keywordLab')
export class KeywordLabController {
  constructor(private service: KeywordLabService) {}

  @Post()
  @ApiOperation({ summary: '키워드랩 POSTBACK' })
  async createKeywordLabLog(@Body() data: CreateKeywordLabLogDto) {
    return await this.service.createKeywordLabLog(data);
  }
}
