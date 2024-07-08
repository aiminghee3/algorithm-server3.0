import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDto{
  @ApiProperty({
    type: String,
    example: '제목입니다.',
  })
  @IsString()
  @IsNotEmpty()
  title : string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  problem_number : number;

  @ApiProperty({
    type: String,
    example: 'https://www.acmicpc.net/problem/1',
  })
  @IsString()
  @IsNotEmpty()
  problem_link: string;

  @ApiProperty({
    type : Number,
    example : 1,
  })
  @IsNumber()
  @IsNotEmpty()
  rate : number;

  @ApiProperty({
    type : String,
    example : '내용입니다.',
  })
  @IsString()
  @IsNotEmpty()
  content : string;

  @ApiProperty({
    type : Date,
    example : new Date(),
  })
  @IsDate()
  @IsOptional()
  alarm? : Date;

  @ApiProperty({
    type : Array,
    example : ['1','2'],
  })
  @IsOptional()
  tags? : string[];
}
