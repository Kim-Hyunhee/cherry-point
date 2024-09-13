import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GreenPService } from './greenP.service';
import { CreateGreenPDto } from './dto';

@ApiTags('greenP')
@Controller('greenP')
export class GreenPController {
  constructor(private service: GreenPService) {}

  @Post()
  @ApiOperation({ summary: 'GreenP POSTBACK' })
  async createPlusCashLog(@Body() data: CreateGreenPDto) {
    return await this.service.createGreenPlog(data);
  }
}
