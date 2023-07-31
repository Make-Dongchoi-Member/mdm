import { Controller, Get, Headers, Query, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 내 정보 API 요청
   * GET("/api/user/me")
   * >>
   * << mydata: MyData
   */
  @Get('me')
  async me(@UserId() userId: string) {
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
    // pipe로 쿼리 유효성 체크 필요
    return await this.userService.getInfoByNickName(nickname);
  }
}
