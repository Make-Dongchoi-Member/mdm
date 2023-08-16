import { Body, Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { AlertListDTO } from './dto/AlertList.dto';
import { AlertData } from 'src/types/interfaces';
import { AlertDTO } from './dto/Alert.dto';

@Controller('api/alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get('list')
  async alertList(@UserId(ParseIntPipe) userId: number): Promise<AlertListDTO> {
    const alarms = await this.alertService.alertList(userId);
    return { alerts: alarms };
  }

  @Post('follow/accept')
  async postFollowAccept(@Body('data') data: AlertDTO): Promise<void> {
    await this.alertService.acceptFollowAlert(
      data.alert.receiver.id,
      data.alert.sender.id,
    );
    await this.alertService.alertDelete(data.alert.alertId);
  }

  @Post('deny')
  async postDeny(@Body('data') data: AlertDTO): Promise<void> {
    await this.alertService.alertDelete(data.alert.alertId);
  }

  // 알람 저장 TEST
  @Post('save')
  async alertSave(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: AlertData,
  ) {
    this.alertService.alertSave(data);
  }
}
