import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Member } from '../../member/entity/member.entity';
import { Post } from '../../post/entity/post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @Column({default : 1})
  depth: number;

  @Column('boolean', { default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Member, (member: Member) => member.comments, { onDelete: 'CASCADE' })
  member: Member;

  @ManyToOne(() => Post, (post: Post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => Comment, (comment: Comment) => comment.children, { onDelete: 'CASCADE' })
  parent: Comment;

  @OneToMany(() => Comment, (comment: Comment) => comment.parent, { cascade: true })
  children: Comment[];
}
