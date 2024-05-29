import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    type: String,
    example: 'accessToken',
  })
  accessToken: String;

  @ApiProperty({
    type: String,
    example: 'refreshToken',
  })
  refreshToken: String;
}
