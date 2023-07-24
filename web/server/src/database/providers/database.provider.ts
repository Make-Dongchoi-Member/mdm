import { DATA_SOURCE } from 'src/configs/constants';
import { DataSource } from 'typeorm';

export const databaseProvider = {
  provide: DATA_SOURCE,
  useFactory: async () => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'example',
      database: 'mydatabase',
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      synchronize: true,
    });
    return dataSource.initialize();
  },
};
