import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { extractTokenFromHeader } from "../common/utils";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "../../member/entity/member.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { InvalidTokenException } from "../exception/auth.exception";

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token : string = extractTokenFromHeader(request);

        if(!token){
          throw new InvalidTokenException();
        }
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('JWT_REFRESH_TOKEN_MEMBER_SECRET_KEY'),
        });
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers

        request['user'] = await this.memberRepository.findOne({ where: { id: payload.userId } });
      } catch (error){
        if(error.name === 'TokenExpiredError'){
          throw new TokenExpiredError("Refresh Token Expired", error.expiredAt);
        }
        throw new InvalidTokenException();
      }
      return true;
    }
}