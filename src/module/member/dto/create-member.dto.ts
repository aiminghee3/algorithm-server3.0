import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import * as constants from 'node:constants';
import { passwordRegExp } from "../../../constants";

export class CreateMemberDto {
  @ApiProperty({
    type: String,
    example: 'test@test.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    example: 'test1234!',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(passwordRegExp)
  password: string;

  @ApiProperty({
    type: String,
    example: 'test1234!',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(passwordRegExp)
  passwordCheck: string;

  @ApiProperty({
    type: String,
    example: 'Fcm token',
  })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;

}
