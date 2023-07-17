import {
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionsFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const cause = exception.cause;
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage =
      exception instanceof Error
        ? exception['message']
        : exception['response']['message'];

    this.logger.error(exception.message, {
      statusCode,
      errorMessage,
      path: req.url,
      cause,
    });

    response.status(statusCode).json({
      statusCode,
      message: errorMessage,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
