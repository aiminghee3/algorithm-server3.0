import { Module } from '@nestjs/common';
import { FcmService } from "./fcm.service";
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [FcmService, ConfigService],
  exports: [FcmService],
})
export class FcmModule {}


