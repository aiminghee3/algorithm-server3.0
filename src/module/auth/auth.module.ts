import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MemberService } from '../member/service/member.service';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../member/entity/member.entity';
import { MemberStrategy } from './strategy/member.strategy';
import { MemberAuthGuard } from "./guard/jwt-auth.guard";

@Module({
  imports: [TypeOrmModule.forFeature([Member]), JwtModule, ConfigModule],
  providers: [
    ConfigService,
    MemberService,
    AuthService,
    MemberStrategy,
    JwtService,
    MemberAuthGuard
  ],
  controllers: [AuthController],
})
export class AuthModule {}
