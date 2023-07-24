import { DataSource } from 'typeorm';
import { Users } from '../entities/user.entity';
import { DATA_SOURCE, USER_REPOSITORY } from 'src/configs/constants';

export const userProvider = {
  provide: USER_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Users),
  inject: [DATA_SOURCE],
};
