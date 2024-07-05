import { HttpException, HttpExceptionOptions } from '@nestjs/common';

export class HttpExceptionWithMessage extends HttpException {
  errorCode: string;
  constructor(
    response: string | Record<string, any>,
    status: number,
    errorCode: string,
    options?: HttpExceptionOptions,
  ) {
    super(response, status, options);
    this.errorCode = errorCode;
  }
}

export class AlreadyExistedException extends HttpExceptionWithMessage {
  constructor(description?: string) {
    super(`Already Existed ${description}`, 409, 'already_existed');
  }
}
