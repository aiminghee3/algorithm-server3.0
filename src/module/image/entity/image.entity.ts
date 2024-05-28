import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../post/entity/post.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @ApiProperty({
    type: String,
    example: '이미지 링크',
  })
  image_link: string;

  @OneToOne(() => Post, (post: Post) => post.image)
  post: Post;
}
