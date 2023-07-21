import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login/login.module';

let staticModule = [];
if (process.env.NODE_ENV === 'production') {
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
  providers: [AppService],
})
export class AppModule {}
