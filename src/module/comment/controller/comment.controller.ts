import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
  Req,
  UsePipes,
  ValidationPipe,
  Version
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CommentService } from "../service/comment.service";
import { JwtVerifyAuthGuard } from "../../../common/decorators";
import { commentDto, CreateCommentDto, UpdateCommentDto } from "../dto/create-comment.dto";
import { IsCommentOwnerGuard } from "../decorators/comment.decorator";
import { IdParam } from "../../../common/dto/IdParam.dto";
import { CreateCommentSwagger, DeleteCommentSwagger, UpdateCommentSwagger } from "./comment-swagger.decorator";
import { DeleteQuery } from "../../../common/dto/deleteQuery.dto";

@Controller('comment')
@ApiTags('comment')
@UsePipes(new ValidationPipe({ transform: true }))
export class CommentController{
    constructor(
      private readonly commentService : CommentService) {}

  @Version('3')
  @JwtVerifyAuthGuard()
  @CreateCommentSwagger()
  @Post()
  async createComment(@Req() req, @Body() body : CreateCommentDto){
    return await this.commentService.createComment(req.user, body);
  }

  @Version('3')
  @Get(':id')
  async getCommentList(@Param() postId : IdParam) : Promise<commentDto>{
    return await this.commentService.getComment(postId.id);
  }

  @Version('3')
  @IsCommentOwnerGuard()
  @UpdateCommentSwagger()
  @Put(':id')
  async updateComment(@Param() commentId : IdParam, @Body() updateCommentDto : UpdateCommentDto){
    return await this.commentService.updateComment(commentId.id, updateCommentDto)
  }

  @Version('3')
  @IsCommentOwnerGuard()
  @DeleteCommentSwagger()
  @Delete('')
  async deleteComment(@Query() query: DeleteQuery){
    return await this.commentService.deleteComment(query.ids);
  }
}