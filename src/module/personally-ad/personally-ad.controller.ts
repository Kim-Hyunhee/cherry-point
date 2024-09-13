import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PersonallyAdService } from './personally-ad.service';
import { ApiTags } from '@nestjs/swagger';
import { ReadPersonallyAdDto } from './dto';

@ApiTags('personally-ad')
@Controller('personally-ad')
export class PersonallyAdController {
  constructor(private personallyAdService: PersonallyAdService) {}

  @Get()
  async getManyPersonallyAd(@Query() query: ReadPersonallyAdDto) {
    return await this.personallyAdService.readManyPersonallyAd(query);
  }

  @Get(':id')
  async getPersonallyAd(@Param('id', ParseIntPipe) personallyAdId: number) {
    return await this.personallyAdService.readPersonallyAd({ personallyAdId });
  }
}
