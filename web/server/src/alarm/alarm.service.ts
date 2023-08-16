import { Injectable, NotFoundException } from '@nestjs/common';
import { AlarmEntity } from 'src/database/entities/alarm.entity';
import { AlarmRepository } from 'src/database/repositories/alarm.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { AlarmData } from 'src/types/interfaces';

@Injectable()
export class AlarmService {
  constructor(
    private readonly alamRepository: AlarmRepository,
    private readonly userRepsitory: UserRepository,
  ) {}

  async alarmList(userId: number) {
    const user = await this.userRepsitory.getUserByIdWithAlarm(userId);
    if (!user) throw new NotFoundException(`user_id ${userId} Not Found`);
    return user.receiveAlarms.map(this.alarmEntityToAlamData);
  }

  async alarmSave(userId: number, alarm: AlarmData) {
    const sender = await this.userRepsitory.getUserById(alarm.sender.id);
    const receiver = await this.userRepsitory.getUserById(alarm.receiver.id);
    await this.alamRepository.saveAlarm(alarm.alarmType, sender, receiver);
  }

  async alarmDelete(alarmId: number) {
    console.log(alarmId);
    await this.alamRepository.delete(alarmId);
  }

  private alarmEntityToAlamData(entity: AlarmEntity): AlarmData {
    return {
      alarmId: entity.id,
      alarmType: entity.type,
      sender: {
        id: entity.sender.id,
        avatar: entity.sender.avatar,
        nickname: entity.sender.nickName,
      },
      receiver: {
        id: entity.receiver.id,
        avatar: entity.receiver.avatar,
        nickname: entity.receiver.nickName,
      },
      date: entity.date,
    };
  }
}
