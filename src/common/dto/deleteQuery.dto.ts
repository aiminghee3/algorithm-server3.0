import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class DeleteQuery {
  @ApiProperty({
    type: String,
    example: 'id1,id2,id3',
    description: ',로 구분해서 id 전달',
  })
  @Transform(({ value }) => value.split(',').map((id: string) => id.trim()))
  ids: string;
}