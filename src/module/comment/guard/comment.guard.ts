import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Comment } from "../entity/comment.entity";

@Injectable()
export class CommentGuard implements CanActivate {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const commentId = request.params.id;

        const comment = await this.commentRepository.findOne({where : {id : commentId}, relations : ['member']})

        if(!comment){
          throw new BadRequestException('해당 댓글이 존재하지 않습니다.');
        }

        if(comment.member.id !== user.id){
          throw new BadRequestException('해당 댓글의 작성자가 아닙니다.');
        }
        return true;
    }
}