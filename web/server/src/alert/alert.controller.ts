import { Body, Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { AlertListDTO } from './dto/AlertList.dto';
import { AlertDTO } from './dto/Alert.dto';
import { GameStore } from 'src/game/game.store';

@Controller('api/alert')
export class AlertController {
  constructor(
    private readonly alertService: AlertService,
    private readonly gameStore: GameStore,
  ) {}

  @Get('list')
  async alertList(@UserId(ParseIntPipe) userId: number): Promise<AlertListDTO> {
    const alerts = await this.alertService.alertList(userId);
    return { alerts: alerts };
  }

  @Post('follow/accept')
  async postFollowAccept(@Body('data') data: AlertDTO): Promise<void> {
    await this.alertService.acceptFollowAlert(
      data.alert.receiver.id,
      data.alert.sender.id,
    );
    await this.alertService.alertDelete(data.alert.alertId);
  }

  @Post('chat/accept')
  async postChatAccept(@Body('data') data: AlertDTO): Promise<void> {
    await this.alertService.acceptChatAlert(
      data.alert.receiver.id,
      +data.alert.roomId,
    );
    await this.alertService.alertDelete(data.alert.alertId);
  }

  @Post('game/accept')
  async postGameAccept(@Body('data') data: AlertDTO): Promise<boolean> {
    await this.alertService.alertDelete(data.alert.alertId);
    return this.gameStore.isPrivateGame(data.alert.roomId);
  }

  @Post('deny')
  async postDeny(@Body('data') data: AlertDTO): Promise<void> {
    await this.alertService.alertDelete(data.alert.alertId);
  }

  @Post('state')
  async postState(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: { state: boolean },
  ): Promise<void> {
    await this.alertService.setAlertState(userId, data.state);
  }
}
