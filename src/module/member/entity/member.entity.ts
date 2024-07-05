import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Post } from '../../post/entity/post.entity';
import { Comment } from '../../comment/entity/comment.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({nullable : true})
  @IsOptional()
  refreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt : Date;


  @OneToMany(() => Post, (post: Post) => post.member)
  posts: Post[];

  @OneToMany(() => Comment, (comments: Comment) => comments.member)
  comments: Comment[];
}
