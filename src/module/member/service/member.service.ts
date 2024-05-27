import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from '../dto/create-member.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MemberService {
  async signUp(body: CreateMemberDto) {
    if (body.password !== body.passwordCheck) {
      throw new BadRequestException('패스워드 불일치');
    }
    const hashedPassword = await bcrypt.hash(
      body.password,
      process.env.SALT_OR_ROUNDS,
    );
  }
}
