import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query, Req,
  UsePipes,
  ValidationPipe,
  Version
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PostService } from "../service/post.service";
import { CreatedTimeResponse } from "../../../common/dto/time-response.dto";
import { CreatePostDto } from "../dto/create-post.dto";
import { IdParam } from "../../../common/dto/IdParam.dto";
import { DeleteQuery } from "../../../common/dto/deleteQuery.dto";
import { JwtVerifyAuthGuard } from "../../../common/decorators";
import { IsPostOwnerGuard } from "../decorators/post.decorator";
import { GetAllPostDto, GetAllPostQuery } from "../dto/get-all-post.dto";
import { GetPostDetailDto } from "../dto/get-post-detail.dto";
import {
  createPostSwagger,
  deletePostSwagger,
  getAllPostSwagger,
  getPostSwagger,
  updatePostSwagger
} from "./post-swagger.decorator";
import { NotificationService } from "../../notification/service/notification.service";
import { Member } from "../../member/entity/member.entity";


@ApiTags('post')
@Controller('post')
@UsePipes(new ValidationPipe({ transform: true }))
export class PostController{
  constructor(
    private readonly postService : PostService,
    private readonly notificationService: NotificationService,
  ) {}


  @Version('3')
  @Post()
  @JwtVerifyAuthGuard()
  @createPostSwagger()
  async createPost(@Req() req, @Body() body: CreatePostDto): Promise<CreatedTimeResponse> {
    await this.notificationService.scheduleNotification(<Member>req.user, body.title, body.alarm);
    return await this.postService.createPost(req.user.id, body);
  }

  @Version('3')
  @Get('/all')
  @getAllPostSwagger()
  async getAllPost(@Query() query : GetAllPostQuery) : Promise<GetAllPostDto>{
    return await this.postService.getAllPost(query);
  }

  @Version('3')
  @Get('/mypage')
  @JwtVerifyAuthGuard()
  async getOwnerPost(@Req() req, @Query() query : GetAllPostQuery) : Promise<GetAllPostDto>{
    return await this.postService.getOwnerPost(req.user.id, query);
  }

  @Version('3')
  @Get(':id')
  @getPostSwagger()
  async getPost(@Param() postId : IdParam) : Promise<GetPostDetailDto>{
    return await this.postService.getPost(postId.id);
  }

  @Version('3')
  @Put(':id')
  @IsPostOwnerGuard()
  @updatePostSwagger()
  async updatePost(@Req() req, @Param() postId : IdParam, @Body() body : CreatePostDto): Promise<CreatedTimeResponse> {
    await this.notificationService.scheduleNotification(<Member>req.user, body.title, body.alarm);
    return await this.postService.updatePost(postId.id, body);
  }

  @Version('3')
  @Delete('')
  @IsPostOwnerGuard()
  @deletePostSwagger()
  async deletePost(@Query() query: DeleteQuery): Promise<CreatedTimeResponse> {
    return await this.postService.deletePost(query.ids);
  }
}