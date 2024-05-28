import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../post/entity/post.entity';
import { Comment } from '../../comment/entity/comment.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  deletedAt: Date;

  @OneToMany(() => Post, (post: Post) => post.member)
  posts: Post[];

  @OneToMany(() => Comment, (comments: Comment) => comments.member)
  comments: Comment[];
}
