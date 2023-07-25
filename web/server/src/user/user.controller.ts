import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 내 정보 API 요청
   * GET("/api/user/me")
   * >>
   * << mydata: MyData
   */
  @Get('me')
  async me(@Req() req: Request) {
    const userId = req['user_id'];
    return await this.userService.getInfoById(+userId);
  }

  /**
   * 다른 유저 정보 API 요청
   * GET(/api/user/info?nickname=[nickname])
   * >> nickname: string
   * << result: UserData
   */
  @Get('info')
  async check(@Query('nickname') nickname: string) {
    return await this.userService.getInfoByNickName(nickname);
  }
}
