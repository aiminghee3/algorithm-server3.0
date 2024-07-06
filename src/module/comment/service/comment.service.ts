import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCommentDto, UpdateCommentDto } from "../dto/create-comment.dto";
import { Comment } from "../entity/comment.entity";
import { Post } from "../../post/entity/post.entity";
import { Member } from "../../member/entity/member.entity";
import { groupBy } from "rxjs";
import { DeletedTimeResponse, UpdatedTimeResponse } from "../../../common/dto/time-response.dto";

@Injectable()
export class CommentService{
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    @InjectRepository(Comment)
    private readonly commentRepository : Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository : Repository<Post>,
  ){}

  // 댓글작성
  async createComment(member : Member, createComment : CreateCommentDto){
    let comment : Comment;

    const post: Post = await this.postRepository.findOne({where : {id : createComment.postId}});
    if(!post){
      throw new BadRequestException('존재하지 않는 게시글입니다.');
    }
    const parentComment : Comment = await this.commentRepository.findOne({where : {id : createComment.parentId}});

    comment = this.commentRepository.create({post, member, comment : createComment.comment, parent : parentComment});

    await this.commentRepository.save(comment);
    return {created : new Date()}
  }

  // 댓글수정
  async updateComment(commentId : string, updateCommentDto : UpdateCommentDto) : Promise<UpdatedTimeResponse>{

    const comment = await this.commentRepository.findOne({where : {id : commentId}, relations: ['member', 'post']});

    if(!comment){
      throw new BadRequestException('존재하지 않는 댓글입니다.');
    }

    const updateComment = {
      ...comment,
      ...updateCommentDto
    }

    await this.commentRepository.save(updateComment);
    return {updated : new Date()};
  }
  // 댓글삭제
  async deleteComment(commandId : string) : Promise<DeletedTimeResponse>{
      const comment = await this.commentRepository.findOne({where : {id : commandId}});
      if(!comment){
        throw new BadRequestException('존재하지 않는 댓글입니다.');
      }
      comment.deleted = true;
      await this.commentRepository.save(comment);

      return {deleted : new Date()};
  }
}