import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostingService } from '../posting/posting.service';
import { CreateTodayHotPostingDto } from './dto';

@ApiTags('admin')
@ApiBearerAuth('access-token')
@UseGuards(AdminGuard)
@UseGuards(JwtAuthGuard)
@Controller('admin/hot-posting')
export class AdminPostingController {
  constructor(private postingService: PostingService) {}

  @Post()
  async savedTodayHotPosting(@Body() { today }: CreateTodayHotPostingDto) {
    return await this.postingService.createTodayHotPosting({ today });
  }

  @Get(':id')
  async getPosting(@Param('id', ParseIntPipe) postingId: number) {
    return await this.postingService.readPosting({ postingId });
  }
}
