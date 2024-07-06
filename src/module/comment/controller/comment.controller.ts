import { Body, Controller, Delete, Param, Post, Put, Req, UsePipes, ValidationPipe, Version } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CommentService } from "../service/comment.service";
import { JwtVerifyAuthGuard } from "../../../common/decorators";
import { CreateCommentDto, UpdateCommentDto } from "../dto/create-comment.dto";
import { IsCommentOwnerGuard } from "../decorators/comment.decorator";
import { IdParam } from "../../../common/dto/IdParam.dto";

@Controller('comment')
@ApiTags('comment')
@UsePipes(new ValidationPipe({ transform: true }))
export class CommentController{
    constructor(
      private readonly commentService : CommentService) {}

  @Version('3')
  @JwtVerifyAuthGuard()
  @Post()
  async createComment(@Req() req, @Body() body : CreateCommentDto){
    return await this.commentService.createComment(req.user, body);
  }


  @Version('3')
  @IsCommentOwnerGuard()
  @Put(':id')
  async updateComment(@Param() commentId : IdParam, @Body() updateCommentDto : UpdateCommentDto){
    return await this.commentService.updateComment(commentId.id, updateCommentDto)
  }

  @Version('3')
  @IsCommentOwnerGuard()
  @Delete(':id')
  async deleteComment(@Param() commentId : IdParam){
    return await this.commentService.deleteComment(commentId.id);
  }
}