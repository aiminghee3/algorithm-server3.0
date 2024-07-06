import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { envValidationSchema } from './config/env-validation.config';
import { winstonConfigFactory } from './config/winston-config';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from './module/member/member.module';
import { AuthModule } from './module/auth/auth.module';
import { typeORMConfig } from "./config/typeorm.config";
import { PostModule } from "./module/post/post.module";
import { CommentModule } from "./module/comment/comment.module";

@Module({
  // 환경변수 파일 검사
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env',
      load : [],
      cache : true,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        await typeORMConfig(configService),
    }),

    WinstonModule.forRootAsync(winstonConfigFactory),
    AuthModule,
    MemberModule,
    PostModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
