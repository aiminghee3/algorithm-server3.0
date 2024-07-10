import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe, Version } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SignUpDescription } from "./member-swagger.decorator";
import { CreateMemberDto } from "../dto/create-member.dto";
import { MemberService } from "../service/member.service";
import { CreatedTimeResponse } from "../../../common/dto/time-response.dto";
import { Member } from "../entity/member.entity";
import { IdParam } from "../../../common/dto/IdParam.dto";

import * as admin from 'firebase-admin';

import { ServiceAccount } from 'firebase-admin';

@Controller('member')
@ApiTags('member')
@UsePipes(new ValidationPipe())
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Version('3')
  @Post('/signup')
  @SignUpDescription()
  async signUp(@Body() body: CreateMemberDto): Promise<CreatedTimeResponse> {
    return this.memberService.signUp(body);
  }

  @Version('3')
  @Get('/all')
  async getAllMember() : Promise<Member[]> {
    return this.memberService.getAllMember();
  }

  @Version('3')
  @Get('/:id')
  async getMember(@Param() memberId : IdParam) : Promise<Member>{
    return this.memberService.getMember(memberId.id);
  }

  @Version('3')
  @Delete('/:id')
  async removeMember(@Param() memberId : IdParam) : Promise<Member> {
    return this.memberService.removeMember(memberId.id);
  }

  @Version('3')
  async updateMember() {}
}
