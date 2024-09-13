import { Module } from '@nestjs/common';
import { AdminNotificationController } from './admin.notification.controller';
import * as admin from 'firebase-admin';
import { AdminNotificationService } from './admin.notification.service';
import { MemberModule } from 'src/module/member/member.module';

@Module({
  controllers: [AdminNotificationController],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
        return admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(serviceAccount)),
        });
      },
    },
    AdminNotificationService,
  ],
  imports: [MemberModule],
})
export class AdminNotificationModule {}
