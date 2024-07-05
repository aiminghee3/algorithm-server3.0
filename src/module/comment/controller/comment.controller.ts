import { Body, Controller, Post, Req, UsePipes, ValidationPipe, Version } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CommentService } from "../service/comment.service";
import { JwtVerifyAuthGuard } from "../../../common/decorators";
import { CreateCommentDto } from "../dto/create-comment.dto";

@Controller('comment')
@ApiTags('comment')
@UsePipes(new ValidationPipe({ transform: true }))
export class CommentController{
    constructor(
      private readonly commentService : CommentService) {}

  @Version('3')
  @Post()
  @JwtVerifyAuthGuard()
  async createComment(@Req() req, @Body() body : CreateCommentDto){
    return await this.commentService.createComment(req.user, body);
  }
}