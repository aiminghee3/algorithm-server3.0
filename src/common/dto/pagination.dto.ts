import { Transform } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PaginationRequest{
  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
    default: 1,
  })
  @Min(1)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  @ApiProperty({
    type: Number,
    example: 10,
    default: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  take: number = 10;
}

export class PaginationResponse{
  @ApiProperty({
    type: Number,
    example: '전체 데이터 개수 ex) 4',
  })
  total: number;

  @ApiProperty({
    type: Number,
    example: '전체 페이지 수 ex) 1',
  })
  totalPages : number;

  @ApiProperty({
    type: Number,
    example: '현재 페이지 ex) 3',
  })
  currentPage : number;
}