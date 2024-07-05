import { HttpExceptionWithMessage } from "../../../common/exception";
import { HttpException } from "@nestjs/common";
import { HttpExceptionOptions } from "@nestjs/common/exceptions/http.exception";


export class TokenExpiredException extends HttpExceptionWithMessage {
  constructor() {
    super('Token expired', 401, 'token_expired');
  }
}

export class InvalidTokenException extends HttpExceptionWithMessage {
  constructor() {
    super(
      '유효하지 않은 토큰입니다.',
      401,
      'invalid_token',
    );
  }
}