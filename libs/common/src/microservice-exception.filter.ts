import { MicroserviceError } from '@app/errors/errors.service';
import { MicroserviceErrorTable } from '@app/errors/microservice.error';
import { Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch()
export class MicroServiceExceptionFilter<T> implements ExceptionFilter {
    catch(exception: T): Observable<never> {
        if (!(exception instanceof MicroserviceError)) {
            return throwError(() => MicroserviceErrorTable.UNKNOWN_ERROR);
        }
        Logger.error(exception.code);
        Logger.error(exception.detail);
        return throwError(() => exception);
    }
}
