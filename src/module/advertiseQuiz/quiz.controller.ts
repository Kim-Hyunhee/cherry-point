import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdvertiseGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuizService } from './quiz.service';
import {
  CreateAdQuizDto,
  CreateManyAdQuizDto,
  ReadAdQuizDto,
  UpdateAdQuizDto,
} from './dto';

@ApiTags('adQuiz')
@ApiBearerAuth('access-token')
@UseGuards(AdvertiseGuard)
@UseGuards(JwtAuthGuard)
@Controller('adQuiz')
export class QuizController {
  constructor(private service: QuizService) {}

  @Post()
  @ApiOperation({ summary: '미션 퀴즈 신규 생성' })
  async postAdQuiz(@Body() data: CreateAdQuizDto) {
    return await this.service.createAdQuiz(data);
  }

  @Post('/many')
  @ApiOperation({ summary: '미션 퀴즈 여러개 신규 생성' })
  async postManyAdQuiz(@Body() datas: CreateManyAdQuizDto) {
    return await this.service.createManyAdQuiz(datas);
  }

  @Get()
  @ApiOperation({ summary: '미션 퀴즈명으로 찾기' })
  async getAdQuizByQuiz(@Query() { quiz }: ReadAdQuizDto) {
    return await this.service.readAdQuiz({ quiz });
  }

  @Get('/all')
  @ApiOperation({ summary: '모든 퀴즈 불러오기' })
  async getAllAdQuiz() {
    return await this.service.readManyAdQuiz();
  }

  @Get(':id')
  @ApiOperation({ summary: '미션 퀴즈명으로 찾기' })
  async getAdQuizById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.readAdQuiz({ id });
  }

  @Patch(':id')
  @ApiOperation({ summary: '미션 퀴즈 수정하기' })
  async patchAdQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body() { quiz }: UpdateAdQuizDto,
  ) {
    return await this.service.updateAdQuiz({ id, quiz });
  }

  @Delete(':id')
  @ApiOperation({ summary: '미션 퀴즈 삭제하기' })
  async deleteAdQuiz(@Param('id', ParseIntPipe) id: number) {
    return await this.service.deleteAdQuiz({ id });
  }
}
