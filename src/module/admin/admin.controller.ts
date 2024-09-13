import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthService } from '../auth/auth.service';
import { AdminLoginDto } from './dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
  ) {}

  @Post('/log-in')
  async postLogin(@Body() { userName, password }: AdminLoginDto) {
    const admin = await this.adminService.readAdmin({ userName });

    await this.authService.checkAdminPassword({ admin, password });

    const token = await this.authService.generateToken({ adminId: admin.id });

    return { token };
  }
}
