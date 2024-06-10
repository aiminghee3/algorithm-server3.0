import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  ): Promise<Member | UnauthorizedException> {
    return await this.authService.validateMember(email, password);
  }
}
