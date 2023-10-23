import { ApiError } from '@app/error';
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException, ApiError)
export class HttpExceptionFilter<T extends ApiError | HttpException>
    implements ExceptionFilter
{
    private Logger = new Logger('Http-Exception');
    catch(exception: T, host: ArgumentsHost) {
        const http = host.switchToHttp();
        const request: Request = http.getRequest();
        const response: Response = http.getResponse();
        const err =
            exception instanceof ApiError
                ? exception
                : new ApiError(exception.getStatus(), -1, exception.message);
        if (err.innerStatus === -1) {
            this.Logger.error(err.message, err.stack);
        }
        response.status(err.status).json({
            path: request.url,
            message: err.message,
            status: err.innerStatus,
        });
    }
}
