import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdvertiserService } from './advertiser.service';
import { AdvertiserLoginDto } from './dto';
import { AuthService } from '../auth/auth.service';
import { exclude } from 'src/common/helper';

@ApiTags('advertiser')
@Controller('advertiser')
export class AdvertiserController {
  constructor(
    private service: AdvertiserService,
    private authService: AuthService,
  ) {}

  @Post('/log-in')
  @ApiOperation({ summary: '광고주 로그인' })
  async postLogin(@Body() { advertiserId, password }: AdvertiserLoginDto) {
    const advertiser = await this.service.readAdvertiserWithPw({
      advertiserId,
    });

    await this.authService.checkAdPassword({ advertiser, password });

    const token = await this.authService.generateToken({
      advertiserId: advertiser.id,
    });

    const readOnly = exclude({ ...advertiser, token: token }, ['password']);

    // return { token };
    return readOnly;
  }
}
