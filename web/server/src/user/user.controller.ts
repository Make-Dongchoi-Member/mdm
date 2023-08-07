import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { SetNicknameDto } from './dto/SetNicknameDto';
import { SetStatusDto } from './dto/SetStatusDto';
import { SetAvatarDto } from './dto/SetAvatarDto';
import { SetSkinDto } from './dto/SetSkinDto';
import { MyData, UserData } from 'src/types/interfaces';

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
  async me(@UserId() userId: string): Promise<MyData> {
    return await this.userService.getMyData(+userId);
  }

  /**
   * 다른 유저 정보 API 요청
   * GET(/api/user/info?nickname=[nickname])
   * >> nickname: string
   * << result: UserData
   */
  @Get('info')
  async info(@Query('nickname') nickname: string): Promise<UserData> {
    // pipe로 쿼리 유효성 체크 필요
    return await this.userService.getUserData(nickname);
  }

  /**
   * 유저 nickname 수정 API 요청
   * POST(/api/user/set/nickname)
   * >> nickname: string
   * <<
   */
  @Post('set/nickname')
  async setNickname(
    @UserId() userId: string,
    @Body('data') data: SetNicknameDto,
  ) {
    await this.userService.setNickname(+userId, data.nickname);
  }

  /**
   * 유저 status 수정 API 요청
   * POST(/api/user/set/status)
   * >> status: string
   * <<
   */
  @Post('set/status')
  async setStatus(@UserId() userId: string, @Body('data') data: SetStatusDto) {
    await this.userService.setStatus(+userId, data.status);
  }

  /**
   * 유저 avatar 수정 API 요청
   * POST(/api/user/set/avatar)
   * >> avatar: string
   * <<
   */
  @Post('set/avatar')
  async setAvatar(@UserId() userId: string, @Body('data') data: SetAvatarDto) {
    await this.userService.setAvatar(+userId, data.avatar);
  }

  /**
   * 유저 skin 수정 API 요청
   * POST(/api/user/set/skin)
   * >> skin: string
   * <<
   */
  @Post('set/skin')
  async setSkin(@UserId() userId: string, @Body('data') data: SetSkinDto) {
    await this.userService.setSkin(+userId, data.skin);
  }
}
