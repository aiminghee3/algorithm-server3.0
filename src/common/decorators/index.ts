import { applyDecorators, UseGuards } from "@nestjs/common";
import { MemberAuthGuard } from "../../module/auth/guard/jwt-auth.guard";

export const JwtVerifyAuthGuard = () =>{
  return applyDecorators(UseGuards(MemberAuthGuard));
}