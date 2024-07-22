import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ServiceException } from "../service.exception";
import { Request, Response } from "express";

@Catch(ServiceException)
export class ServiceExceptionToHttpExceptionFilter implements ExceptionFilter{
  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.errorCode.status;


    response
      .status(status)
      .json({
        statusCode: status,
        message: exception.message,
        code : exception.errorCode.code,
        path: request.url,
      });

  }
}