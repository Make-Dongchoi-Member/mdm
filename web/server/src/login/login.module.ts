import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { HttpModule } from '@nestjs/axios';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtModule } from '@nestjs/jwt';
import { PendingUserService } from './objects/pending-user.service';
import { DatabaseModule } from 'src/database/database.module';
import {
  JWT_SECRET,
  MAILER_PASS,
  MAILER_USER,
  SMTP_HOST,
} from 'src/configs/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './guards/login.jwt.guard';

@Module({
  imports: [
    HttpModule,
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get(SMTP_HOST),
          auth: {
            user: config.get(MAILER_USER),
            pass: config.get(MAILER_PASS),
          },
        },
        defaults: {
          from: 'MDM <mdm@gmail.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get(JWT_SECRET),
        signOptions: { expiresIn: '42d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Users]),
    DatabaseModule.forCustomRepository([UserRepository]),
  ],
  controllers: [LoginController],
  providers: [
    LoginService,
    PendingUserService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class LoginModule {}
