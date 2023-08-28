import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPublic } from './guards/login.jwt.public.decorator';
import { APP_URL } from 'src/configs/constants';

@Controller('api/login')
@JwtPublic()
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  @Redirect()
  async login(@Req() req: Request) {
    const token = await req.cookies['access_token'];
    let url: string;
    if (!token) {
      url = await this.loginService.oAuth42AccessUrl();
    } else {
      const tokenValid = await this.loginService.tokenValidCheck(token);
      if (tokenValid) {
        url = this.config.get(APP_URL);
      } else {
        url = await this.loginService.oAuth42AccessUrl();
      }
    }
    return { url };
  }

  @Get('oauth42')
  @Redirect()
  async oauth42(@Query('code') code: string, @Res() res: Response) {
    let url: string = this.config.get(APP_URL);
    if (!code) throw new BadRequestException();
    const user = await this.loginService.generatePendingUser(code);
    if (user.accessToken) {
      res.cookie('access_token', user.accessToken);
    } else {
      url = url + '/verify';
      res.cookie('user_id', user.id);
    }
    return { url };
  }

  @Post('mailauth')
  async mailAuth(
    @Body('emailCode') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.cookies['user_id'];
    if (!userId) throw new BadRequestException();
    const accessToken = await this.loginService.verifyEmailCode(+userId, code);
    res.cookie('access_token', accessToken);
    return res.send();
  }
}
