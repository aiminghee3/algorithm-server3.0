import { PaginationRequest, PaginationResponse } from "../../../common/dto/pagination.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class GetAllPostQuery extends PaginationRequest{
  @ApiProperty({
    type : String,
    required : false,
    nullable : true,
  })
  @IsString()
  @IsOptional()
  title? : string;
}

export class GetPostDto{
  @ApiProperty({
    type : String,
    example : 'id',
  })
  @IsString()
  id : string;

  @ApiProperty({
    type : String,
    example : '게시글 제목',
  })
  @IsString()
  title : string;

  @ApiProperty({
    type : Number,
    example : '문제번호(INT)',
  })
  @IsNumber()
  problem_number : number;

  @ApiProperty({
    type : String,
    example : '난이도 이미지'
  })
  @IsString()
  image : string

  @ApiProperty({
    type : Date,
    example: new Date(),
  })
  @IsDate()
  createdAt : Date;

  @ApiProperty({
    type : Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt : Date;

  @ApiProperty({
    type : Array,
    example : ['tag1','tag2'],
  })
  tag : string[];
}
export class GetAllPostDto extends PaginationResponse{
  @ApiProperty({
    type : GetPostDto,
    isArray : true,
  })
  posts : GetPostDto[];
}