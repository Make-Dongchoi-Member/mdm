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
import { MyData, OtherUserData } from 'src/types/interfaces';
import { InfoValidPipe } from './pipes/info.valid.pipe';
import { SetNicknameValidPipe } from './pipes/setnickname.valid.pipe';
import { UserNicknameDto } from './dto/UserNickname.dto';
import { UserState } from 'src/types/enums';
import { SearchUserDTO } from './dto/SearchUser.dto';
import { Limit } from './guards/limit.guard';
import { BlackListDTO } from './dto/BlackListDto';
import { SetTwoFactorAuthDTO } from './dto/SetTwoFactorAuthDto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@UserId(ParseIntPipe) userId: number): Promise<MyData> {
    return await this.userService.getMyData(userId);
  }

  @Get('blacklist')
  async blackList(@UserId(ParseIntPipe) userId: number): Promise<BlackListDTO> {
    return await this.userService.getBlackList(userId);
  }

  @Get('info')
  async info(
    @UserId(ParseIntPipe) userId: number,
    @Query('nickname', InfoValidPipe) nickname: string,
  ): Promise<OtherUserData> {
    return await this.userService.getUserData(userId, nickname);
  }

  @Get('search')
  async search(
    @Query('nickname', InfoValidPipe) nickname: string,
  ): Promise<SearchUserDTO> {
    return this.userService.searchUser(nickname);
  }

  @Post('set/nickname')
  async setNickname(
    @UserId(ParseIntPipe) userId: number,
    @Body('data', SetNicknameValidPipe) data: UserNicknameDto,
  ) {
    await this.userService.setNickname(userId, data.nickname);
  }

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

  @Limit(1024 * 1024 * 3)
  @Post('set/avatar')
  async setAvatar(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: SetAvatarDto,
  ) {
    await this.userService.setAvatar(userId, data.avatar);
  }

  @Post('set/two_factor_auth')
  async setTwoFactorAuth(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: SetTwoFactorAuthDTO,
  ) {
    await this.userService.setTwoFactorAuth(userId, data.twoFactorAuth);
  }

  @Post('friend/delete')
  async friendDelete(
    @UserId(ParseIntPipe) userId: number,
    @Body('data', SetNicknameValidPipe) data: UserNicknameDto,
  ) {
    await this.userService.friendDelete(userId, data.nickname);
  }

  @Post('block/request')
  async blockRequest(
    @UserId(ParseIntPipe) userId: number,
    @Body('data', SetNicknameValidPipe) data: UserNicknameDto,
  ) {
    await this.userService.blockRequest(userId, data.nickname);
  }

  @Post('block/cancel')
  async blockCancel(
    @UserId(ParseIntPipe) userId: number,
    @Body('data', SetNicknameValidPipe) data: UserNicknameDto,
  ) {
    await this.userService.blockCancel(userId, data.nickname);
  }

  @Post('friend/request')
  async friendRequest(
    @UserId(ParseIntPipe) userId: number,
    @Query('nickname', InfoValidPipe) nickname: string,
  ) {
    await this.userService.friendRequest(userId, nickname);
  }

  @Post('game')
  async addGame(
    @UserId(ParseIntPipe) userId: number,
    @Query('nickname', InfoValidPipe) nickname: string,
  ) {
    await this.userService.addGame(userId, nickname);
  }
}
