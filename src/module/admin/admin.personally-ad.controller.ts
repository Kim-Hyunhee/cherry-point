import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PersonallyAdService } from 'src/module/personally-ad/personally-ad.service';
import {
  CreatePersonallyAdDto,
  ModifyPersonallyAdDto,
  ModifyPersonallyAdIsShowDto,
} from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('admin')
@ApiBearerAuth('access-token')
@UseGuards(AdminGuard)
@UseGuards(JwtAuthGuard)
@Controller('admin/personally-ad')
export class AdminPersonallyAdController {
  constructor(private personallyAdService: PersonallyAdService) {}

  @Post()
  async postPersonallyAd(@Body() body: CreatePersonallyAdDto) {
    return await this.personallyAdService.createPersonallyAd(body);
  }

  @Put(':id')
  async putPersonallyAd(
    @Param('id', ParseIntPipe) personallyAdId: number,
    @Body() body: ModifyPersonallyAdDto,
  ) {
    return await this.personallyAdService.modifyPersonallyAd({
      personallyAdId,
      data: body,
    });
  }

  @Patch(':id/is-show')
  async patchPersonallyAdIsShow(
    @Param('id', ParseIntPipe) personallyAdId: number,
    @Body() { isShow }: ModifyPersonallyAdIsShowDto,
  ) {
    return await this.personallyAdService.modifyPersonallyAdIsShow({
      personallyAdId,
      isShow,
    });
  }

  @Delete(':id')
  async deletePersonallyAd(@Param('id', ParseIntPipe) personallyAdId: number) {
    return await this.personallyAdService.removePersonallyAd({
      personallyAdId,
    });
  }
}
