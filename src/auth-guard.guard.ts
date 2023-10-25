import { JwtService } from '@app/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwt: JwtService) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest<Request>();
        if (!req.headers.authorization) {
            return false;
        }
        const token = req.headers.authorization.replace('Bearer ', '');
        try {
            const verifyObject = this.jwt.verify<{ tid: string }>(token, {
                algorithms: ['RS256'],
            });
            req['user'] = verifyObject;
        } catch {
            return false;
        }
        return true;
    }
}
