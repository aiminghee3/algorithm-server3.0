import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";


export class commentDto{
  @ApiProperty({
    type : String,
    example : 'id',
  })
  @IsString()
  id : string;

  @ApiProperty({
    type : String,
    example : '이메일',
  })
  @IsString()
  email : string;

  @ApiProperty({
    type : String,
    example : '댓글작성자 아이디',
  })
  memberId : string;

  @ApiProperty({
    type : String,
    example : '댓글',
  })
  @IsString()
  comment : string;

  @ApiProperty({
    type : Number,
    example : '댓글 깊이',
  })
  @IsNumber()
  depth : number;

  @ApiProperty({
    type : Boolean,
    example : '삭제유무',
  })
  @IsBoolean()
  deleted : boolean;

  @ApiProperty({
    type : String,
    example : '작성일',
  })
  @IsDate()
  createdAt: Date;
}

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

export class UpdateCommentDto{
  @ApiProperty({
    type : String,
    example : '댓글내용',
  })
  @IsString()
  comment : string;
}
