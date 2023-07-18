import {
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
    } else {
      // 로그인 url
      // url = 로그인 url
    }
    return url;
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
  async oauth42(@Query('code') code: string) {
    if (!code) {
      // error
    } else {
      // email 인증 url로 redirect
    }
  }

  /**
   * 메일 인증
   * 인증 코드는 body로 전송받음
   * 인증이 완료되면 user 생성 및 DB에 저장
   * access_toekn 발급
   */
  @Post('mailauth')
  async mailAuth(
    @Query('user_id') userId: string,
    @Body('email_code') code: string,
    @Res() res: Response,
  ) {}
}
