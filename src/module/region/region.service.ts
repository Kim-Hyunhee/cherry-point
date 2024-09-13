import { Injectable } from '@nestjs/common';
import { RegionRepository } from './region.repository';
import { ReadRegionDto } from './dto';

@Injectable()
export class RegionService {
  constructor(private repository: RegionRepository) {}

  async readCities() {
    return await this.repository.findCities();
  }

  async readRegions({ cityCode }: ReadRegionDto) {
    return await this.repository.findRegions({ cityCode });
  }
}
