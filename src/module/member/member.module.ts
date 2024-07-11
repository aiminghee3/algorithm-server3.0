import { MemberController } from './controller/member.controller';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entity/member.entity';
import { MemberService } from './service/member.service';
import { FcmService } from "../fcm/fcm.service";

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}


