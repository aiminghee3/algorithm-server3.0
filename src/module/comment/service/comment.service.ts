import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { Comment } from "../entity/comment.entity";
import { Post } from "../../post/entity/post.entity";
import { Member } from "../../member/entity/member.entity";
import { groupBy } from "rxjs";

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
  /**
   * postId
   * parentId?
   * memberId
   * comment
   */
  async createComment(member : Member, body : CreateCommentDto){
    let comment : Comment;
    let depth: number = 1;

    const post: Post = await this.postRepository.findOne({where : {id : body.postId}});
    if(!post){
      throw new BadRequestException('존재하지 않는 게시글입니다.');
    }
    const parentComment : Comment = await this.commentRepository.findOne({where : {id : body.parentId}});

    comment = this.commentRepository.create({post, member, comment : body.comment, parent : parentComment});

    await this.commentRepository.save(comment);
  }
  // 댓글수정
  async updateComment(){

  }
  // 댓글삭제
  async deleteComment(){

  }
}