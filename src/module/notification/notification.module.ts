import { Module } from '@nestjs/common';
import { NotificationService } from "./service/notification.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bull";
import { NotificationProcessor } from "./processor/notification.processor";

@Module({
  imports:[
    ConfigModule.forRoot(),
    BullModule.forRootAsync({
      imports:[ConfigModule],
      useFactory : async(configService: ConfigService) => ({
        redis:{
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  providers: [NotificationService, NotificationProcessor, ConfigService],
  exports: [NotificationService],

})
export class NotificationModule {}


