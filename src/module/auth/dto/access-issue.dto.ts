import { ApiProperty } from '@nestjs/swagger';

export class IssueAccessTokenByRefreshTokenDto {
  @ApiProperty({
    type: String,
    example: 'accessToken',
  })
  accessToken: String;
}
