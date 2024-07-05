import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./entity/post.entity";
import { ConfigService } from "@nestjs/config";
import { PostController } from "./controller/post.controller";
import { PostService } from "./service/post.service";
import { PostHashTag } from "./entity/postHashTag.entity";
import { Tag } from "./entity/tag.entity";
import { Member } from "../member/entity/member.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostHashTag, Tag, Member]), JwtModule],
  providers: [ConfigService, PostService],
  controllers: [PostController],
})
export class PostModule {}