import { MemberController } from './controller/member.controller';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [ConfigService],
  controllers: [MemberController],
})
export class MemberModule {}
