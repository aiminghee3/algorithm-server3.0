import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatedTimeResponse {
  @IsDate()
  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  created: Date;
}
