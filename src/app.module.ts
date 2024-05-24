import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env-validation.config';
import { winstonConfigFactory } from './config/winston-config';
import { WinstonModule } from 'nest-winston';

@Module({
  // 환경변수 파일 검사
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env',
      validationSchema: envValidationSchema,
    }),
    // Logger 설정
    WinstonModule.forRootAsync(winstonConfigFactory),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
