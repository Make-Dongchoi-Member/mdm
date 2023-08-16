import { Body, Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { AlertListDTO } from './dto/AlertList.dto';
import { AlertData } from 'src/types/interfaces';

@Controller('api/alarm')
export class AlertController {
  constructor(private readonly alarmService: AlertService) {}

  @Get('list')
  async alertList(@UserId(ParseIntPipe) userId: number): Promise<AlertListDTO> {
    const alarms = await this.alarmService.alertList(userId);
    return { alarms };
  }

  // 알람 저장 TEST
  @Post('save')
  async alertSave(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: AlertData,
  ) {
    this.alarmService.alertSave(data);
  }

  // 알람 삭제 TEST
  @Post('delete')
  async alertDelete(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: number,
  ) {
    this.alarmService.alertDelete(data);
  }
}
