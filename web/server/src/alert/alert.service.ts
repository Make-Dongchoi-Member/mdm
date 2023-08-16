import { Injectable, NotFoundException } from '@nestjs/common';
import { AlarmEntity } from 'src/database/entities/alarm.entity';
import { AlertRepository } from 'src/database/repositories/alarm.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { AlertData } from 'src/types/interfaces';

@Injectable()
export class AlertService {
  constructor(
    private readonly alamRepository: AlertRepository,
    private readonly userRepsitory: UserRepository,
  ) {}

  async alertList(userId: number) {
    const user = await this.userRepsitory.getUserByIdWithAlarm(userId);
    if (!user) throw new NotFoundException(`user_id ${userId} Not Found`);
    return user.receiveAlarms.map(this.alertEntityToAlertData);
  }

  async alertSave(alarm: AlertData) {
    const sender = await this.userRepsitory.getUserById(alarm.sender.id);
    const receiver = await this.userRepsitory.getUserById(alarm.receiver.id);
    await this.alamRepository.saveAlert(alarm.alertType, sender, receiver);
  }

  async alertDelete(alarmId: number) {
    console.log(alarmId);
    await this.alamRepository.delete(alarmId);
  }

  private alertEntityToAlertData(entity: AlarmEntity): AlertData {
    return {
      alertId: entity.id,
      alertType: entity.type,
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

  async getSocketId(userId: number): Promise<string> | null {
    const user = await this.userRepsitory.getUserById(userId);
    return user.socket;
  }
}
