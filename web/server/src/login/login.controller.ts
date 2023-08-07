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
import { APP_URL, DEV_URL } from 'src/configs/constants';

@Controller('api/login')
@JwtPublic()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  /**
   * 쿠키확인(access_token)
   *  토큰 있음 => 로크인
   *  토큰 없음 => 42oauth로 redirect(42 로그인 페이지)
   */
  @Get()
  @Redirect()
  async login(@Req() req: Request) {
    const token = await req.cookies['access_token'];
    let url: string;
    if (!token) {
      // oauth42로 redirect
      url = await this.loginService.oAuth42AccessUrl();
    } else {
      // 로그인 url
      // url = 로그인 url
      // @TODO
      // token vaild check
      const tokenValid = await this.loginService.tokenValidCheck(token);
      if (tokenValid) {
        if (new ConfigService().get('NODE_ENV') === 'prod') {
          url = new ConfigService().get(APP_URL);
        } else {
          url = new ConfigService().get(DEV_URL);
        }
      } else {
        url = await this.loginService.oAuth42AccessUrl();
      }
    }
    return { url };
  }

  /**
   * 쿼리 파라미터 확인('code')
   *  code 있음
   *    => token 발급, 임시사용자 생성, email 전송
   *       email 인증 url로 redirect
   *  code 없음
   *    => error
   */
  @Get('oauth42')
  @Redirect()
  async oauth42(@Query('code') code: string, @Res() res: Response) {
    let url: string;
    if (new ConfigService().get('NODE_ENV') === 'prod') {
      url = new ConfigService().get(APP_URL) + '/verify';
    } else {
      url = new ConfigService().get(DEV_URL) + '/verify';
    }
    if (!code) {
      // error
      throw new BadRequestException();
    } else {
      // email 인증 url로 redirect
      const user = await this.loginService.generatePendingUser(code);
      res.cookie('user_id', user.id);
    }
    return { url };
  }

  /**
   * 메일 인증
   * 인증 코드는 body로 전송받음
   * 인증이 완료되면 user 생성 및 DB에 저장
   * access_toekn 발급
   */
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
