import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto{
  @ApiProperty({
    type : String,
    example : '게시글 아이디'
  })
  @IsString()
  postId : string;

  @ApiProperty({
    type : String,
    example : '부모아이디',
  })
  @IsString()
  @IsOptional()
  parentId? : string;

  @ApiProperty({
    type : String,
    example : '댓글내용',
  })
  @IsString()
  comment : string;
}
