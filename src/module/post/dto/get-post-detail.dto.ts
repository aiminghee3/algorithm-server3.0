import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";

export class hashtagDto{
  @ApiProperty({
    type : String,
    example : '해시태그',
  })
  @IsString()
  name : string;
}

export class commentDto{
  @ApiProperty({
    type : String,
    example : 'id',
  })
  @IsString()
  id : string;

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

export class GetPostDetailDto{
  @ApiProperty({
    type : String,
    example : 'id',
  })
  @IsString()
  id : string;


  @ApiProperty({
    type : String,
    example : '작성자',
  })
  memberId : string;

  @ApiProperty({
    type : String,
    example : '작성자 이메일',
  })
  email : string;

  @ApiProperty({
    type : String,
    example : '제목',
  })
  @IsString()
  title : string;

  @ApiProperty({
    type : Number,
    example : '문제번호',
  })
  @IsNumber()
  problem_number : number;

  @ApiProperty({
    type : String,
    example : '문제링크'
  })
  @IsString()
  problem_link : string;

  @ApiProperty({
    type : String,
    example : '난이도이미지',
  })
  @IsNumber()
  image_link : string;

  @ApiProperty({
    type : Date,
    example : '복습 알림 날짜',
  })
  @IsDate()
  alarm : Date;

  @ApiProperty({
    type : Date,
    example : '생성일',
  })
  @IsDate()
  createdAt : Date;

  @ApiProperty({
    type : Date,
    example : '최근 업데이트 일',
  })
  @IsDate()
  updatedAt : Date;

  @ApiProperty({
    type : hashtagDto,
    isArray : true,
  })
  hashtag : hashtagDto[];

  @ApiProperty({
    type : commentDto,
    isArray : true,
  })
  comments: commentDto[];
}
