import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { MemberJwtPayloadDto } from '../dto/payload.dto';
import { Member } from '../../member/entity/member.entity';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { LoginResponseDto } from '../dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(member: Member): Promise<LoginResponseDto> {
      const accessToken: string = await this.createMemberAccessToken(member);
      const refreshToken: string = await this.createMemberRefreshToken(member);
      await this.memberRepository.update(member.id, {
        refreshToken: refreshToken,
      });
      return {
        accessToken,
        refreshToken,
      };
  }

  async issueNewAccessTokenByRefreshToken(member : Member) {
      const accessToken : string = await this.createMemberAccessToken(member);
      return {
        accessToken
      };
  }

  async createMemberAccessToken(member: Member) {
    const payload: MemberJwtPayloadDto = {
      userId: member.id,
    };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_MEMBER_SECRET_KEY'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_TIME'),
    });
  }

  async createMemberRefreshToken(member: Member) {
    const payload: MemberJwtPayloadDto = {
      userId: member.id,
    };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_MEMBER_SECRET_KEY'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_TIME'),
    });
  }

  createManagerAccessToken() {}

  createManagerRefreshToken() {}

  async validateMember(
    email: string,
    password: string,
  ): Promise<Member | UnauthorizedException> {
    const member: Member | null = await this.memberRepository.findOneBy({
      email: email,
    });
    if (!member) {
      throw new BadRequestException('존재하지 않는 회원입니다.');
    }
    else if(!(await this.checkPassword(password, member.password))){
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
    return member;
  }

  async checkPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    if (!password || !hashedPassword) {
      return Promise.resolve(false);
    }
    return compare(password, hashedPassword);
  }
}
