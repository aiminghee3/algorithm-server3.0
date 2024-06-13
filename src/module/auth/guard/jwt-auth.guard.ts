import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../../member/entity/member.entity';
import { Repository } from 'typeorm';
import { extractTokenFromHeader } from "../common/utils";

@Injectable()
export class MemberAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: string = extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_MEMBER_SECRET_KEY'),
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = await this.memberRepository.findOne({ where: { id: payload.userId } });
    } catch (error){
      if(error.name === 'TokenExpiredError'){
        throw new TokenExpiredError("Access Token Expired", error.expiredAt);
      }
      throw new UnauthorizedException();
    }
    return true;
  }
}
