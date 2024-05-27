import { Body, Controller, Post, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDescription } from './member-swagger.decorator';
import { CreateMemberDto } from '../dto/create-member.dto';

@Controller('member')
@ApiTags('member')
export class MemberController {
  @Version('3')
  @Post('/signup')
  @SignUpDescription()
  async SignUp(@Body() body: CreateMemberDto) {
    console.log('test');
  }

  @Version('3')
  async getMember() {
    return 'member';
  }

  @Version('3')
  async getAllMember() {}
}
