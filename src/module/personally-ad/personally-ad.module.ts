import { Module } from '@nestjs/common';
import { PersonallyAdController } from './personally-ad.controller';
import { PersonallyAdService } from './personally-ad.service';
import { PersonallyAdRepository } from './personally-ad.repository';

@Module({
  controllers: [PersonallyAdController],
  providers: [PersonallyAdService, PersonallyAdRepository],
  exports: [PersonallyAdService],
})
export class PersonallyAdModule {}
