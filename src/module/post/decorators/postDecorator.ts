import { PostGuard } from "../guard/post.guard";
import { MemberAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { applyDecorators, UseGuards } from "@nestjs/common";

export const IsPostOwnerGuard = () =>{
  return applyDecorators(UseGuards(MemberAuthGuard, PostGuard));
}