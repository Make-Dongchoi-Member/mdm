import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/database/entities/user.entity';
import { AlarmEntity } from 'src/database/entities/alarm.entity';
import { DatabaseModule } from 'src/database/database.module';
import { AlarmRepository } from 'src/database/repositories/alarm.repository';
import { UserRepository } from 'src/database/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, AlarmEntity]),
    DatabaseModule.forCustomRepository([AlarmRepository, UserRepository]),
  ],
  providers: [AlarmService],
  controllers: [AlarmController],
})
export class AlarmModule {}
