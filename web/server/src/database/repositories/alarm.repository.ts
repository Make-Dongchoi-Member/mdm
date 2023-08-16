import { CustomRepository } from 'src/decorators/customrepository.decorator';
import { AlarmEntity as AlertEntity } from '../entities/alarm.entity';
import { ArrayContains, Repository } from 'typeorm';
import { AlertType as AlertType } from 'src/types/enums';
import { Users } from '../entities/user.entity';

@CustomRepository(AlertEntity)
export class AlertRepository extends Repository<AlertEntity> {
  async saveAlert(type: AlertType, sender: Users, receiver: Users) {
    const date = new Date();
    const entity = this.create({
      date,
      type,
      sender,
      receiver,
    });
    this.save(entity);
  }

  async userHasAlert(user: Users) {
    const alarm = this.findOne({
      where: {
        receiver: ArrayContains([user]),
      },
    });
    return alarm !== null;
  }
}
