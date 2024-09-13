import { Module, forwardRef } from '@nestjs/common';
import { AdvertiserService } from './advertiser.service';
import { AdvertiserAdminController } from './advertiser.admin.controller';
import { AdvertiserMeController } from './advertiser.me.controller';
import { AdvertiserController } from './advertiser.controller';
import { AdvertiserRepository } from './repositories/advertiser.repository';
import { AdvertiserPointRepository } from './repositories/advertiserPoint.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [
    AdvertiserRepository,
    AdvertiserService,
    AdvertiserPointRepository,
  ],
  controllers: [
    AdvertiserController,
    AdvertiserAdminController,
    AdvertiserMeController,
  ],
  imports: [forwardRef(() => AuthModule)],
  exports: [AdvertiserService],
})
export class AdvertiserModule {}
