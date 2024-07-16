import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Like, Repository } from "typeorm";
import { Post } from "../entity/post.entity";
import { CreatePostDto } from "../dto/create-post.dto";
import { Member } from "../../member/entity/member.entity";
import { Tag } from "../entity/tag.entity";
import { PostHashTag } from "../entity/postHashTag.entity";
import { CreatedTimeResponse } from "../../../common/dto/time-response.dto";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { PaginationRequest } from "../../../common/dto/pagination.dto";
import { GetAllPostDto, GetAllPostQuery, GetPostDto } from "../dto/get-all-post.dto";
import { GetPostDetailDto, hashtagDto } from "../dto/get-post-detail.dto";
import { plainToClass } from "class-transformer";
import { Image } from "../../image/entity/image.entity";

@Injectable()
export class PostService{
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Member)
    private readonly memberRepository : Repository<Member>,
    @InjectRepository(Tag)
    private readonly hashTagRepository : Repository<Tag>,
    @InjectRepository(PostHashTag)
    private readonly postHashTagRepository : Repository<PostHashTag>,
    @InjectRepository(Image)
    private readonly imageRepository : Repository<Image>,
  ) {}

  async createPost(memberId : string, post : CreatePostDto) : Promise<CreatedTimeResponse>{
    const member : Member = await this.memberRepository.findOneBy({id : memberId});
    if(!member){
      throw new NotFoundException('존재하지 않는 회원입니다.');
    }
    const image = await this.imageRepository.findOneBy({id : post.rate.toString()})
    const createdPost: Post = this.postRepository.create(post);
    createdPost.member = member;
    createdPost.image = image;

    const savedPost = await this.postRepository.save(createdPost);

    for (const tagId  of post.tags){
      let hashTag : Tag = await this.hashTagRepository.findOneBy({id : tagId});
      const postHashTag : PostHashTag = this.postHashTagRepository.create({
        post : savedPost,
        tag : hashTag,
      });
      await this.postHashTagRepository.save(postHashTag);
    }

    return {created : new Date()};
  }

  async getPost(postId : string) : Promise<GetPostDetailDto>{
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.postHashtags', 'postHashtags')
      .leftJoinAndSelect('post.member', 'member')
      .leftJoinAndSelect('post.image', 'image')
      .leftJoinAndSelect('postHashtags.tag', 'tag')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.children', 'children')
      .where('post.id = :postId', { postId })
      .orderBy('comments.createdAt', 'ASC')  // 부모 댓글 작성일 순 정렬
      .addOrderBy('children.createdAt', 'ASC')  // 자식 댓글 작성일 순 정렬
      .getOne();

    if(!post){
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }

    return plainToClass(GetPostDetailDto, {
      id: post.id,
      memberId : post.member.id,
      email : post.member.email,
      title: post.title,
      problem_number: post.problem_number,
      problem_link: post.problem_link,
      image : post.image.image_link,
      rate : post.rate,
      content: post.content,
      alarm: post.alarm,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      hashtag: post.postHashtags.map(hashtag => plainToClass(hashtagDto, {
        name: hashtag.tag.name,
      })),
    });
  }

  async getOwnerPost(memberId : string, query : PaginationRequest){
    const [posts , total] = await this.postRepository.findAndCount({
      where: {
        ...this.updateToSearchQuery(query),
        member: { id: memberId }
      },
      relations: ['postHashtags.tag', 'image', 'member'],
      take : query.take + 1,
      skip : (query.page - 1) * query.take
    });

    return this.generateReturnPostList(posts, total, query);
  }


  async getAllPost(query : GetAllPostQuery) : Promise<GetAllPostDto>{
    const [posts, total] = await this.postRepository.findAndCount({
        where : {...this.updateToSearchQuery(query)},
        relations: ['postHashtags.tag', 'image'],
        take : query.take + 1,
        skip : (query.page - 1) * query.take
      });

    return this.generateReturnPostList(posts, total, query);
  }

  async updatePost(postId : string, updatePostDto : CreatePostDto) : Promise<CreatedTimeResponse>{
    try {
      await this.postRepository.manager.transaction(async (transaction: EntityManager) => {
        const post = await transaction.findOne(Post, { where: { id: postId }, relations: ['postHashtags', 'member'] });
        const image = await this.imageRepository.findOneBy({id : updatePostDto.rate.toString()})
        if (!post) {
          throw new NotFoundException('존재하지 않는 게시글입니다.');
        }
        post.postHashtags = [];
        const updatePost = {
          ...post,
          ...updatePostDto
        }
        updatePost.image = image;
        await transaction.delete(PostHashTag, { post: { id: postId } });

        for (const tagId of updatePostDto.tags) {
          let hashTag: Tag = await transaction.findOneBy(Tag, { id: tagId });
          const postHashTag: PostHashTag = transaction.create(PostHashTag, {
            post: updatePost,
            tag: hashTag,
          });
          updatePost.postHashtags.push(postHashTag);
        }
        await transaction.save(Post, updatePost);
      });
      return { created: new Date() };
    }catch(error){
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async deletePost(postIds : string) : Promise<CreatedTimeResponse> {
    try {
      await this.postRepository.manager.transaction(async (transaction: EntityManager) => {
        for (const id of postIds) {
          const post = await transaction.findOne(Post, {where : {id : id}});
          if (!post) {
            throw new NotFoundException(id + '번 아이디는 존재하지 않는 게시글입니다.');
          }
          await transaction.delete(Post, { id: id })
        }
      })
      return { created: new Date() };
    }
    catch(error){
      this.logger.error(error);
      this.logger.error(postIds);
      throw new InternalServerErrorException();
    }
  }

  private generateReturnPostList(posts : Post[], total : number, query : GetAllPostQuery){

    const result: Array<GetPostDto> = [];

    for (const p of posts){
      result.push({
        id : p.id,
        title : p.title,
        problem_number : p.problem_number,
        image : p.image.image_link,
        tags : p.postHashtags.map((postHashTag) => postHashTag.tag.name),
        createdAt : p.createdAt,
        updatedAt : p.updatedAt
      })
    }

    return {
      posts : result,
      total : total,
      totalPages: Math.ceil(total / (query.take + 1)),
      currentPage : query.page
    }
  }


  private updateToSearchQuery(query : GetAllPostQuery){
    let search = {};
    if (query.title) {
      search = {
        ...search,
        title: Like(`%${query.title}%`)
      };
    }

    return search;
  }
}