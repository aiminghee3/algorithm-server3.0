import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { number } from 'joi';
import { text } from 'express';
import { Member } from '../../member/entity/member.entity';
import { Image } from '../../image/entity/image.entity';
import { Comment } from '../../comment/entity/comment.entity';
import { PostHashtag } from './postHashtag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number;

  @Column()
  @ApiProperty({
    type: String,
    example: '제목',
  })
  title: string;

  @Column()
  @ApiProperty({
    type: number,
    example: '문제번호',
  })
  problem_number: number;

  @Column()
  @ApiProperty({
    type: String,
    example: '문제링크',
  })
  problem_link: string;

  @Column()
  @ApiProperty({
    type: number,
    example: '중요도',
  })
  rate: number;

  @Column()
  @ApiProperty({
    type: text,
    example: '내용',
  })
  content: string;

  @Column()
  @ApiProperty({
    type: Date,
    example: '알림받을날짜',
  })
  alarm: Date;

  @CreateDateColumn()
  @ApiProperty({
    type: Date,
    example: '생성일자',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    type: Date,
    example: '수정일자',
  })
  updatedAt: Date;

  @ManyToOne(() => Member, (member: Member) => member.posts)
  member: Member;

  @OneToMany(() => Comment, (comments: Comment) => comments.post)
  comments: Comment[];

  @OneToMany(() => PostHashtag, (postHashtag: PostHashtag) => postHashtag.post)
  postHashtags: PostHashtag[];

  @OneToOne(() => Image, (image: Image) => image.post)
  @JoinColumn()
  image: Image;
}
