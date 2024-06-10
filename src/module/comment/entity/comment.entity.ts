import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from '../../member/entity/member.entity';
import { Post } from '../../post/entity/post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  depth: number;

  @Column('boolean', { default: true })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Member, (member: Member) => member.comments)
  member: Member;

  @ManyToOne(() => Post, (post: Post) => post.comments)
  post: Post;

  @ManyToOne(() => Comment, (comment: Comment) => comment.children)
  parent: Comment;

  @OneToMany(() => Comment, (comment: Comment) => comment.parent)
  children: Comment[];
}
