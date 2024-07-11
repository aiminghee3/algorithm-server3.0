import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAccessGuard } from "../../module/auth/guard/jwt-auth.guard";

export const JwtVerifyAuthGuard = () =>{
  return applyDecorators(UseGuards(JwtAccessGuard));
}