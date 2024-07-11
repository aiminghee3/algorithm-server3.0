import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../service/auth.service';
import { Member } from '../../member/entity/member.entity';

@Injectable()
export class MemberStrategy extends PassportStrategy(Strategy, 'member') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Member> {
    const member = await this.authService.validateMember(email, password);
    if(!member){
      throw new NotFoundException('존재하지 않는 회원입니다.');
    }
    return member;
  }
}

