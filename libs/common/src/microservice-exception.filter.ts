import { MicroserviceError } from '@app/errors/errors.service';
import { MicroserviceErrorTable } from '@app/errors/microservice.error';
import { Catch, ExceptionFilter, Logger, ValidationPipe } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch()
export class MicroServiceExceptionFilter<T> implements ExceptionFilter {
    private logger: Logger = new Logger('Microservice');
    catch(exception: T): Observable<never> {
        if (!(exception instanceof MicroserviceError)) {
            return throwError(() => MicroserviceErrorTable.UNKNOWN_ERROR);
        }
        this.logger.error(exception.code);
        this.logger.error(exception.message);
        exception.detail.forEach((d) => this.logger.error(d));
        return throwError(() => exception);
    }
}

export const createValidationPipe = () =>
    new ValidationPipe({
        exceptionFactory(errors) {
            const details = [];
            for (let i = 0; i < errors.length; i++) {
                const err = errors[i];
                details.push(...Object.values(err.constraints));
            }
            throw MicroserviceErrorTable.PARAM_INVALIDATE(details);
        },
    });
