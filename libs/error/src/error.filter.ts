import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiError } from './Errors';

@Catch()
export class ErrorFilter<T extends Error | ApiError>
    implements ExceptionFilter
{
    catch(exception: T, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response: Response = context.getResponse();
        let err: ApiError;
        if (!(exception instanceof ApiError)) {
            err = new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                -1,
                'UNKNOW_ERROR',
            );
        } else {
            err = exception;
        }
        return response.status(err.status).json({
            status: err.innerStatus,
            message: err.message,
        });
    }
}
