import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { InjectRepository } from "@nestjs/typeorm";
import { commentDto, CreateCommentDto, UpdateCommentDto } from "../dto/create-comment.dto";
import { Comment } from "../entity/comment.entity";
import { Post } from "../../post/entity/post.entity";
import { Member } from "../../member/entity/member.entity";
import { DeletedTimeResponse, UpdatedTimeResponse } from "../../../common/dto/time-response.dto";
import { plainToClass } from "class-transformer";

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
    let depth = 1;

    const post: Post = await this.postRepository.findOne({where : {id : createComment.postId}});
    if(!post){
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }
    if(createComment.parentId){
      const parentComment : Comment = await this.commentRepository.findOne({where : {id : createComment.parentId}});
      comment = this.commentRepository.create({post, member, comment : createComment.comment, parent : parentComment, depth : depth + 1});
    }
    else{
      comment = this.commentRepository.create({post, member, comment : createComment.comment, depth : depth});
    }

    await this.commentRepository.save(comment);
    return {created : new Date()}
  }

  async getComment(postId : string) : Promise<commentDto>{

    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.member', 'member')
      .leftJoinAndSelect('comment.children', 'children')
      .leftJoinAndSelect('children.member', 'childMember')
      .where('comment.postId = :postId', { postId })
      .orderBy('comment.createdAt', 'ASC')  // 부모 댓글 작성일 순 정렬
      .addOrderBy('children.createdAt', 'ASC')  // 자식 댓글 작성일 순 정렬
      .getMany();

    return plainToClass(commentDto, {
      comments: comments
        .filter(comment => comment.depth === 1)
        .map(comment => plainToClass(commentDto, {
          id: comment.id,
          email : comment.member.email,
          memberId : comment.member.id,
          comment: comment.comment,
          depth: comment.depth,
          deleted: comment.deleted,
          createdAt: comment.createdAt,
          children: comment.children
            .map(child => plainToClass(commentDto, {
              id: child.id,
              email : child.member.email,
              memberId : child.member.id,
              comment: child.comment,
              depth: child.depth,
              deleted: child.deleted,
              createdAt: child.createdAt,
            })),
        })),
    });
  }

  // 댓글수정
  async updateComment(commentId : string, updateCommentDto : UpdateCommentDto) : Promise<UpdatedTimeResponse>{

    const comment = await this.commentRepository.findOne({where : {id : commentId}, relations: ['member', 'post']});

    if(!comment){
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }

    const updateComment = {
      ...comment,
      ...updateCommentDto
    }

    await this.commentRepository.save(updateComment);
    return {updated : new Date()};
  }
  // 댓글삭제
  async deleteComment(commandIds : string) : Promise<DeletedTimeResponse>{
      for(const id of commandIds){
        const comment = await this.commentRepository.findOne({where : {id : id}});
        if(!comment){
          throw new NotFoundException('존재하지 않는 댓글입니다.');
        }
        comment.deleted = true;
        await this.commentRepository.save(comment);
      }

      return {deleted : new Date()};

  }

}