import { applyDecorators, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { CreatedTimeResponse } from '../../../common/dto/created-time.dto';
import { AlreadyExistedException } from '../../auth/exception/auth.exception';

export const SignUpDescription = () => {
  return applyDecorators(
    ApiOperation({
      summary: '사이트 회원가입',
      description: '비밀번호는 8~15영문 특수문자포함',
      deprecated: false,
    }),
    ApiOkResponse({
      type: CreatedTimeResponse,
    }),
    ApiException(() => [AlreadyExistedException]),
  );
};
