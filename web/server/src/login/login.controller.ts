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

@Controller('login')
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
      console.log(url);
    } else {
      // 로그인 url
      // url = 로그인 url
      url = new ConfigService().get('APP_URL');
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
    // const url = new ConfigService().get('APP_URL') + '/mailauth';
    const url = new ConfigService().get('APP_URL') + '/verify';
    if (!code) {
      // error
      throw new BadRequestException();
    } else {
      // email 인증 url로 redirect
      const user = await this.loginService.generatePendingUser(code);
      res.cookie('user_id', user.id);
      // res.header('user_id', `${user.id}`);
      // res.header('user_email', user.email);
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
    // @Query('user_id') userId: string,
    @Body('email_code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.cookies['user_id'];
    const accessToken = await this.loginService.verifyEmailCode(+userId, code);
    res.cookie('access_token', accessToken);

    return res.send();
  }
}
