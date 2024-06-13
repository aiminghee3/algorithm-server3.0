import { applyDecorators, NotFoundException } from '@nestjs/common';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { CreatedTimeResponse } from '../../../common/dto/created-time.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';
import { IssueAccessTokenByRefreshTokenDto } from "../dto/access-issue.dto";

export const loginDescription = () => {
  return applyDecorators(
    ApiOperation({
      summary: '사이트 로그인',
      description: '로그인 성공시 access, refresh 토큰 발급',
      deprecated: false,
    }),
    ApiOkResponse({
      type: LoginResponseDto,
    }),
    ApiException(() => [NotFoundException]),
  );
};

export const accessByRefreshDescription = () =>{
  return applyDecorators(
    ApiOperation({
      summary : 'refresh 토큰 필요',
      description : 'access 토큰 만료 시 refresh 토큰을 통해 재발급',
      deprecated : false,
    }),
    ApiOkResponse({
      type : IssueAccessTokenByRefreshTokenDto,
    }),
    ApiException(() => [NotFoundException])
  )
}

