import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as constants from 'node:constants';
import { passwordCheck } from '../../../constants';

export class CreateMemberDto {
  @ApiProperty({
    type: String,
    example: 'test@test.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    example: 'test1234!',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(passwordCheck)
  password: string;

  @ApiProperty({
    type: String,
    example: 'test1234!',
  })
  @IsString()
  @IsNotEmpty()
  passwordCheck: string;
}
