import { BadRequestException, CanActivate, Injectable } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface";
import { Observable } from "rxjs";
import { Post } from "../entity/post.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PostGuard implements CanActivate{
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const postId = request.params.id;

    const post = await this.postRepository.findOne({where : {id : postId}, relations :['member']});

    if(!post){
      throw new BadRequestException('해당 게시글이 존재하지 않습니다.');
    }
    if(post.member.id !== user.id){
      throw new BadRequestException('해당 게시글의 작성자가 아닙니다.');
    }
    return true;
  }
}