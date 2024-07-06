import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMemberDto } from '../dto/create-member.dto';
import { DataSource, Repository } from 'typeorm';
import { Member } from '../entity/member.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistedException } from '../../../common/exception';
import { CreatedTimeResponse } from '../../../common/dto/time-response.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async signUp(body: CreateMemberDto): Promise<CreatedTimeResponse> {
    const member : Member = await this.memberRepository.findOneBy({ email: body.email });
    if (member) {
      throw new AlreadyExistedException(member.email);
    }

    if (body.password !== body.passwordCheck) {
      throw new BadRequestException('패스워드 불일치');
    }

    const hashedPassword: string = await bcrypt.hash(
      body.password,
      parseInt(process.env.SALT_OR_ROUNDS, 10),
    );

    const saveMember: Member = this.memberRepository.create({
      email: body.email,
      password: hashedPassword,
    });
    await this.memberRepository.save(saveMember);

    return {
      created: new Date(),
    };
  }

  async getAllMember(): Promise<Member[]> {
    return await this.memberRepository.find()
  }

  async getMember(id: string) : Promise<Member>{
    const findMember = await this.memberRepository.findOneBy({
      id: id,
    });
    if(!findMember){
      throw new NotFoundException('존재하지 않는 회원입니다.');
    }
    return findMember;
  }

  async removeMember(id : string) : Promise<Member>{
    const member = await this.memberRepository.findOneBy({id : id});
    if(!member){
      throw new NotFoundException('존재하지 않는 회원입니다.');
    }
    return await this.memberRepository.softRemove(member);
  }
}
