import { HttpException, HttpExceptionOptions } from '@nestjs/common';

export class ExceptionWithMessage extends HttpException {
  errorCode: string;
  constructor(
    message: string | Record<string, any>,
    status: number,
    errorCode: string,
    options?: HttpExceptionOptions,
  ) {
    super(message, status, options);
    this.errorCode = errorCode;
  }
}

export class AlreadyExistedException extends ExceptionWithMessage {
  constructor(description?: string) {
    super(`Already Existed ${description}`, 409, 'already_existed');
  }
}
