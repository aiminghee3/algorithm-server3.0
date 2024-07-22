import { HttpException, HttpExceptionOptions } from '@nestjs/common';
import { ServiceException } from "./service.exception";
import { ENTITY_NOT_FOUND, INTERNAL_SERVER_ERROR } from "./error-code";

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

export const EntityNotFoundException = (message? : string): ServiceException =>{
  return new ServiceException(ENTITY_NOT_FOUND, message)
}
export const InternalServerException = (message? : string): ServiceException =>{
  return new ServiceException(INTERNAL_SERVER_ERROR, message)
}