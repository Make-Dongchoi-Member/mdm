import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login/login.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './login/guards/login.jwt.guard';

let staticModule = [];
if (process.env.NODE_ENV === 'prod') {
  staticModule = [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ];
}

@Module({
  imports: [
    ...staticModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoginModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
