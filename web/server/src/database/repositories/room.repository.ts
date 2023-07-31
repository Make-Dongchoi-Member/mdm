import { Repository } from 'typeorm';
import { Rooms } from '../entities/room.entity';
import { CustomRepository } from 'src/decorators/customrepository.decorator';

@CustomRepository(Rooms)
export class RoomRepository extends Repository<Rooms> {}
