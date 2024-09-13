import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RegionService } from './region.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReadRegionDto } from './dto';

@ApiTags('region')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('region')
export class RegionController {
  constructor(private service: RegionService) {}

  @Get('/cities')
  @ApiOperation({ summary: '도시 목록 가져오기' })
  async getCities() {
    return await this.service.readCities();
  }

  @Get('/regions')
  @ApiOperation({ summary: '시군구 목록 가져오기' })
  async getRegions(@Query() { cityCode }: ReadRegionDto) {
    return await this.service.readRegions({ cityCode });
  }
}
