import { JwtService } from '@app/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(private readonly jwt: JwtService) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const ws = context.switchToWs();
        const client = ws.getClient<Socket>();
        const token = client.handshake.headers.authorization
            .replace('Bearer', '')
            .trim();
        try {
            const verifyObject = this.jwt.verify<{ tid: string }>(token, {
                algorithms: ['RS256'],
            });
            client.handshake['user'] = verifyObject;
        } catch {
            return false;
        }
        return true;
    }
}
