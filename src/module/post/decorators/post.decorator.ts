import { PostGuard } from "../guard/post.guard";
import { JwtAccessGuard } from "../../auth/guard/jwt-auth.guard";
import { applyDecorators, UseGuards } from "@nestjs/common";

export const IsPostOwnerGuard = () =>{
  return applyDecorators(UseGuards(JwtAccessGuard, PostGuard));
}