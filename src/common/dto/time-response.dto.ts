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

export class UpdatedTimeResponse {
  @IsDate()
  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updated: Date;
}

export class DeletedTimeResponse {
  @IsDate()
  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  deleted: Date;
}