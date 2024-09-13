import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { SystemRepository } from './system.repository';

@Module({
  controllers: [SystemController],
  providers: [SystemService, SystemRepository],
  exports: [SystemService],
})
export class SystemModule {}
