import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Tag } from './tag.entity';

@Entity()
export class PostHashTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Post, (post: Post) => post.postHashtags, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => Tag, (tag: Tag) => tag.postHashtags, { onDelete: 'CASCADE' })
  tag: Tag;
}
