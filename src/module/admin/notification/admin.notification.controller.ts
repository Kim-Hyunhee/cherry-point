import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../../auth/admin.guard';
import { JwtAuthGuard } from 'src/module/auth/jwt-auth.guard';
import { SendNotificationDto } from './dto';
import { AdminNotificationService } from './admin.notification.service';

@ApiTags('admin/notification')
@ApiBearerAuth('access-token')
@UseGuards(AdminGuard)
@UseGuards(JwtAuthGuard)
@Controller('admin/notification')
export class AdminNotificationController {
  constructor(private service: AdminNotificationService) {}

  @Post()
  async postNotification(@Body() noti: SendNotificationDto) {
    // return await this.service.sendNotification({ noti });
    await this.service.sendNotification({ noti });
    return true;
  }
}
