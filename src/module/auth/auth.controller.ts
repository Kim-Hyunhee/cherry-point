import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateTokenDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/token')
  async generateToken(@Body() { memberId }: CreateTokenDto) {
    const token = await this.authService.generateToken({ memberId });

    return { token };
  }
}
