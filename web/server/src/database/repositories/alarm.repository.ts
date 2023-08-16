import { CustomRepository } from 'src/decorators/customrepository.decorator';
import { AlarmEntity } from '../entities/alarm.entity';
import { ArrayContains, Repository } from 'typeorm';
import { AlarmType } from 'src/types/enums';
import { Users } from '../entities/user.entity';

@CustomRepository(AlarmEntity)
export class AlarmRepository extends Repository<AlarmEntity> {
  async saveAlarm(type: AlarmType, sender: Users, receiver: Users) {
    const date = new Date();
    const entity = this.create({
      date,
      type,
      sender,
      receiver,
    });
    this.save(entity);
  }

  async userHasAlarm(user: Users) {
    const alarm = this.findOne({
      where: {
        receiver: ArrayContains([user]),
      },
    });
    return alarm !== null;
  }
}
