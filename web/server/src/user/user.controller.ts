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
import { SetStatusDto } from './dto/SetStatusDto';
import { SetAvatarDto } from './dto/SetAvatarDto';
import { SetSkinDto } from './dto/SetSkinDto';
import { MyData, OtherUserData, UserData } from 'src/types/interfaces';
import { InfoValidPipe } from './pipes/info.valid.pipe';
import { SetNicknameValidPipe } from './pipes/setnickname.valid.pipe';
import { UserNicknameDto } from './dto/UserNickname.dto';
import { UserState } from 'src/types/enums';
import { SearchUserDTO } from './dto/SearchUser.dto';
import { Limit } from './guards/limit.guard';

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
   * 사용자 검색
   * GET(/api/user/search?nickname=[nickname])
   * >> nickname: string
   * << result: { exist: boolean, user: UserData }
   */
  @Get('search')
  async search(
    @Query('nickname', InfoValidPipe) nickname: string,
  ): Promise<SearchUserDTO> {
    return this.userService.searchUser(nickname);
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
    @Body('data', SetNicknameValidPipe) data: UserNicknameDto,
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
    await this.userService.setStatus(userId, data.status as UserState);
  }

  @Get('get/status')
  async getStatus(
    @UserId(ParseIntPipe) userId: number,
    @Query('nickname', InfoValidPipe) nickname: string,
  ) {
    return { state: await this.userService.getStatus(nickname) };
  }

  /**
   * 유저 avatar 수정 API 요청
   * POST(/api/user/set/avatar)
   * >> avatar: string
   * <<
   */
  @Limit(1024 * 1024 * 3)
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
   * @TODO
   * 친구 신청 API -> 알림
   * 게임 신청 API -> 알림
   * 로그아웃 요청 API
   */

  /**
   * 친구 삭제 API 요청
   * POST(/api/user/friend/delete)
   * >> nickname: string
   * <<
   */
  @Post('friend/delete')
  async friendDelete(
    @UserId(ParseIntPipe) userId: number,
    @Body('data', SetNicknameValidPipe) data: UserNicknameDto,
  ) {
    await this.userService.friendDelete(userId, data.nickname);
  }

  /**
   * 차단 요청 API
   * POST(/api/usr/block/request)
   * >> nickname: string
   * <<
   */
  @Post('block/request')
  async blockRequest(
    @UserId(ParseIntPipe) userId: number,
    @Body('data', SetNicknameValidPipe) data: UserNicknameDto,
  ) {
    await this.userService.blockRequest(userId, data.nickname);
  }

  /**
   * 차단 취소 요청 API
   * POST(/api/usr/block/cancel)
   * >> nickname: string
   * <<
   */
  @Post('block/cancel')
  async blockCancel(
    @UserId(ParseIntPipe) userId: number,
    @Body('data', SetNicknameValidPipe) data: UserNicknameDto,
  ) {
    await this.userService.blockCancel(userId, data.nickname);
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

  /**
   * 게임 추가 TEST
   * 사용금지
   */
  @Post('game')
  async addGame(
    @UserId(ParseIntPipe) userId: number,
    @Query('nickname', InfoValidPipe) nickname: string,
  ) {
    await this.userService.addGame(userId, nickname);
  }
}
