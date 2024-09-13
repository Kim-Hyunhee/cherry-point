import { Injectable } from '@nestjs/common';
import { SystemRepository } from './system.repository';
import { ModifySystemDto, ReadSystemDto } from './dto';

@Injectable()
export class SystemService {
  constructor(private repository: SystemRepository) {}

  async readSystemInfo(select: ReadSystemDto) {
    const param = { id: true, ...select };

    return await this.repository.findSystemInfo(param);
  }

  async updateSystemInfo(data: ModifySystemDto) {
    const id = (await this.repository.findSystemInfo({ id: true })).id;

    return await this.repository.updateSystemInfo({ id, data });
  }
}
