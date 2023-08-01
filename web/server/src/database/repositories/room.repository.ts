import { In, Not, Repository } from 'typeorm';
import { Rooms } from '../entities/room.entity';
import { CustomRepository } from 'src/decorators/customrepository.decorator';
import { RoomType } from 'src/types/enums';

@CustomRepository(Rooms)
export class RoomRepository extends Repository<Rooms> {
  async publicRooms() {
    return this.findBy({ roomtype: Not(RoomType.PRIVATE) });
  }

  async userEnteredRooms(userId: number) {
    return this.find({
      where: [
        { host: userId },
        { admin: In([userId]) },
        { members: In[userId] },
      ],
    });
  }

  async getRoomById(id: number) {
    return this.findOneBy({ id });
  }
}
