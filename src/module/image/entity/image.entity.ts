import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../post/entity/post.entity';

@Entity()
export class Image {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty({
    type: String,
    example: '이미지 링크',
  })
  image_link: string;

  @OneToMany(() => Post, (post: Post) => post.image)
  post: Post;
}
