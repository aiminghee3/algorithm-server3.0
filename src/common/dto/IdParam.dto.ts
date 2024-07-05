import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class IdParam {

  @ApiProperty({
    type: Number,
    example: '파라미터의 아이디값',
    description : 'id값을 전달'
  })
  @IsString()
  id: string;
}