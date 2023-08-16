import { Body, Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { AlarmListDTO } from './dto/AlarmList.dto';
import { AlarmData } from 'src/types/interfaces';

@Controller('api/alarm')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Get('list')
  async alarmList(@UserId(ParseIntPipe) userId: number): Promise<AlarmListDTO> {
    const alarms = await this.alarmService.alarmList(userId);
    return { alarms };
  }

  // 알람 저장 TEST
  @Post('save')
  async alarmSave(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: AlarmData,
  ) {
    this.alarmService.alarmSave(userId, data);
  }

  // 알람 삭제 TEST
  @Post('delete')
  async alarmDelete(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: number,
  ) {
    this.alarmService.alarmDelete(data);
  }
}
