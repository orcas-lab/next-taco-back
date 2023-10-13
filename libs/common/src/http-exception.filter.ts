import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { ServiceError, status } from '@grpc/grpc-js';
import { Response } from 'express';
import { ApiError } from '@app/errors/errors.service';

const codes = {
    [status.CANCELLED]: HttpStatus.METHOD_NOT_ALLOWED,
    [status.UNKNOWN]: HttpStatus.BAD_GATEWAY,
    [status.INVALID_ARGUMENT]: HttpStatus.UNPROCESSABLE_ENTITY,
    [status.DEADLINE_EXCEEDED]: HttpStatus.REQUEST_TIMEOUT,
    [status.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [status.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
    [status.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_REQUIRED,
    [status.ABORTED]: HttpStatus.METHOD_NOT_ALLOWED,
    [status.OUT_OF_RANGE]: HttpStatus.PAYLOAD_TOO_LARGE,
    [status.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
    [status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
    [status.UNAVAILABLE]: HttpStatus.NOT_FOUND,
    [status.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
    [status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
};
@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
    private logger: Logger = new Logger('Http');
    catch(exception: T & ServiceError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        if (exception instanceof ApiError) {
            return response
                .status(exception.status)
                .send({ message: exception.message });
        }
        if (exception?.details) {
            const { code, details } = exception as ServiceError;
            this.logger.error(JSON.stringify(exception));
            return response.status(codes[code]).send({ details });
        }
    }
}
