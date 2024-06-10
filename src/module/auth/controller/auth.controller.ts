import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../service/auth.service';
import { LocalMemberGuard } from '../guard/local.guard';
import { Member } from '../../member/entity/member.entity';
import { LoginResponseDto } from '../dto/login-response.dto';
import { loginDescription } from './auth-swagger.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('3')
  @Post('/login')
  @UseGuards(LocalMemberGuard)
  @loginDescription()
  async login(
    @Req() request: Request,
    @Body() body: LoginDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(<Member>request.user);
  }
}
