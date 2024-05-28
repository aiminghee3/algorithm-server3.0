import { Body, Controller, Get, Post, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDescription } from './member-swagger.decorator';
import { CreateMemberDto } from '../dto/create-member.dto';
import { MemberService } from '../service/member.service';
import { CreatedTimeResponse } from '../../../common/dto/created-time.dto';
import { Member } from '../entity/member.entity';

@Controller('member')
@ApiTags('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Version('3')
  @Post('/signup')
  @SignUpDescription()
  async SignUp(@Body() body: CreateMemberDto): Promise<CreatedTimeResponse> {
    return this.memberService.signUp(body);
  }

  @Version('3')
  async getMember() {
    return 'member';
  }

  @Version('3')
  @Get('all')
  async getAllMember(): Promise<Member[]> {
    return this.memberService.getAllMember();
  }

  @Version('3')
  async findMember() {}

  @Version('3')
  async deleteMember() {}

  @Version('3')
  async updateMember() {}
}
