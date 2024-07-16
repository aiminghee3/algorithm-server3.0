import { Module } from '@nestjs/common';
import { NotificationService } from "./service/notification.service";
import { ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bull";
import { NotificationProcessor } from "./processor/notification.processor";

@Module({
  imports:[
    BullModule.forRoot({
      redis:{
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  providers: [NotificationService, NotificationProcessor, ConfigService],
  exports: [NotificationService],

})
export class NotificationModule {}


