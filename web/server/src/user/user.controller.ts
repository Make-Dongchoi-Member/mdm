import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { SetNicknameDto } from './dto/SetNicknameDto';
import { SetStatusDto } from './dto/SetStatusDto';
import { SetAvatarDto } from './dto/SetAvatarDto';
import { SetSkinDto } from './dto/SetSkinDto';
import { MyData, OtherUserData, UserData } from 'src/types/interfaces';
import { InfoValidPipe } from './pipes/info.valid.pipe';
import { SetNicknameValidPipe } from './pipes/setnickname.valid.pipe';

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
  async me(@UserId(ParseIntPipe) userId: number): Promise<MyData> {
    return await this.userService.getMyData(userId);
  }

  /**
   * 다른 유저 정보 API 요청
   * GET(/api/user/info?nickname=[nickname])
   * >> nickname: string
   * << result: UserData
   */
  @Get('info')
  async info(
    @UserId(ParseIntPipe) userId: number,
    @Query('nickname', InfoValidPipe) nickname: string,
  ): Promise<OtherUserData> {
    return await this.userService.getUserData(userId, nickname);
  }

  /**
   * 유저 nickname 수정 API 요청
   * POST(/api/user/set/nickname)
   * >> nickname: string
   * <<
   */
  @Post('set/nickname')
  async setNickname(
    @UserId(ParseIntPipe) userId: number,
    @Body('data', SetNicknameValidPipe) data: SetNicknameDto,
  ) {
    await this.userService.setNickname(userId, data.nickname);
  }

  /**
   * 유저 status 수정 API 요청
   * POST(/api/user/set/status)
   * >> status: string
   * <<
   */
  @Post('set/status')
  async setStatus(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: SetStatusDto,
  ) {
    await this.userService.setStatus(userId, data.status);
  }

  /**
   * 유저 avatar 수정 API 요청
   * POST(/api/user/set/avatar)
   * >> avatar: string
   * <<
   */
  @Post('set/avatar')
  async setAvatar(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: SetAvatarDto,
  ) {
    await this.userService.setAvatar(userId, data.avatar);
  }

  /**
   * 유저 skin 수정 API 요청
   * POST(/api/user/set/skin)
   * >> skin: string
   * <<
   */
  @Post('set/skin')
  async setSkin(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: SetSkinDto,
  ) {
    await this.userService.setSkin(userId, data.skin);
  }

  /**
   * 친구신청 TEST
   * 사용금지
   */
  @Post('friend/request')
  async friendRequest(
    @UserId(ParseIntPipe) userId: number,
    @Query('nickname', InfoValidPipe) nickname: string,
  ) {
    await this.userService.friendRequest(userId, nickname);
  }
}
