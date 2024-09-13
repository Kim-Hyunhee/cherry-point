import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReadEventDto } from './dto';

@ApiTags('event')
@ApiBearerAuth('access-token')
@UseGuards(AdminGuard)
@UseGuards(JwtAuthGuard)
@Controller('event')
export class EventController {
  constructor(private service: EventService) {}

  @Get('/all')
  @ApiOperation({
    summary: '이벤트 목록 가져오기',
    description: '푸시알림 사용시 page 보내지 말것',
  })
  async getAllEvents(@Query() data: ReadEventDto) {
    if (data.page) {
      return await this.service.readEventsWithFilter({ data });
    } else {
      return await this.service.readEvents({ data });
    }
  }
}
