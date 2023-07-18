import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { HttpModule } from '@nestjs/axios';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtModule } from '@nestjs/jwt';
import { PendingUserService } from './objects/pending-user.service';

@Module({
  imports: [
    HttpModule,
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService, handlebar: HandlebarsAdapter) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          auth: {
            user: config.get('MAILER_USER'),
            pass: config.get('MAILER_PASS'),
          },
        },
        defaults: {
          from: '"MDM"',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: handlebar,
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
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '42d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, PendingUserService],
})
export class LoginModule {}
