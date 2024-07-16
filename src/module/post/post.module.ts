import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./entity/post.entity";
import { PostController } from "./controller/post.controller";
import { PostService } from "./service/post.service";
import { PostHashTag } from "./entity/postHashTag.entity";
import { Tag } from "./entity/tag.entity";
import { Member } from "../member/entity/member.entity";
import { Image } from "../image/entity/image.entity";
import { JwtModule } from "@nestjs/jwt";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostHashTag, Tag, Member, Image]), JwtModule, NotificationModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}