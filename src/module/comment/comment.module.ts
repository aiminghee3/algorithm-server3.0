import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [ConfigService],
  controllers: [],
})
export class MemberModule {}
