import { applyDecorators, NotFoundException } from '@nestjs/common';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { CreatedTimeResponse } from '../../../common/dto/created-time.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';

export const loginDescription = () => {
  return applyDecorators(
    ApiOperation({
      summary: '사이트 로그인',
      description: '로그인 성공시 토큰 발급',
      deprecated: false,
    }),
    ApiOkResponse({
      type: LoginResponseDto,
    }),
    ApiException(() => [NotFoundException]),
  );
};
