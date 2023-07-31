import { DATA_SOURCE, ROOM_REPOSITORY } from 'src/configs/constants';
import { Rooms } from '../entities/room.entity';
import { DataSource } from 'typeorm';

export const roomProvider = {
  provide: ROOM_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Rooms),
  inject: [DATA_SOURCE],
};
