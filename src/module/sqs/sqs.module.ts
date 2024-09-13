import { Module } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { AdvertiserModule } from '../advertiser/advertiser.module';

@Module({
  providers: [SqsService],
  exports: [SqsService],
  imports: [AdvertiserModule],
})
export class SqsModule {}
