import { CustomRepository } from 'src/decorators/customrepository.decorator';
import { AlertEntity as AlertEntity } from '../entities/alert.entity';
import { ArrayContains, Repository } from 'typeorm';
import { AlertType as AlertType } from 'src/types/enums';
import { Users } from '../entities/user.entity';

@CustomRepository(AlertEntity)
export class AlertRepository extends Repository<AlertEntity> {
  async saveAlert(
    type: AlertType,
    sender: Users,
    receiver: Users,
    roomId?: number,
  ) {
    const date = new Date();
    const entity = this.create({
      date,
      type,
      sender,
      receiver,
    });
    if (roomId) {
      entity.roomId = roomId;
    }
    this.save(entity);
  }

  async userHasAlert(user: Users) {
    const alert = this.findOne({
      where: {
        receiver: ArrayContains([user]),
      },
    });
    return alert !== null;
  }
}
