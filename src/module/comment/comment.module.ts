import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { CommentService } from "./service/comment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "../member/entity/member.entity";
import { CommentController } from "./controller/comment.controller";
import { Comment } from "./entity/comment.entity"
import { Post } from "../post/entity/post.entity";
import { JwtModule } from "@nestjs/jwt";


@Module({
  imports: [TypeOrmModule.forFeature([Comment, Member, Post]), JwtModule],
  providers: [ConfigService, CommentService],
  controllers: [CommentController],
})
export class CommentModule {}

