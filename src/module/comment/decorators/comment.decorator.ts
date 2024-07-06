import { CommentGuard } from "../guard/comment.guard";
import { JwtAccessGuard } from "../../auth/guard/jwt-auth.guard";
import { applyDecorators, UseGuards } from "@nestjs/common";

export const IsCommentOwnerGuard = () =>{
  return applyDecorators(UseGuards(JwtAccessGuard, CommentGuard));
}