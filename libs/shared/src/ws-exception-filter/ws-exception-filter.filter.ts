import { PUSHER_ERROR, PusherError } from '@app/error';
import {
    ArgumentsHost,
    Catch,
    Logger,
    WsExceptionFilter as WebSocketExceptionFilter,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { omit } from 'ramda';
import { Socket } from 'socket.io';

@Catch(WsException, PusherError)
export class WsExceptionFilter<T> implements WebSocketExceptionFilter {
    private logger: Logger = new Logger('WsException');
    catch(exception: T, host: ArgumentsHost) {
        const req = host.switchToWs();
        const ws = req.getClient<Socket>();
        if (exception instanceof PusherError) {
            ws.emit('error', omit(['disconnect'], exception));
            if (exception.disconnect) {
                ws.disconnect(true);
            }
        } else {
            const wsException = exception as WsException;
            this.logger.error(wsException.message, wsException.stack);
            const pusherErr = PUSHER_ERROR.UNKNOWN_ERROR;
            ws.emit('error', pusherErr);
            ws.disconnect(true);
        }
    }
}
