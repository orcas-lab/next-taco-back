import { JWT_PRI_KEY_NAME, JWT_PUB_KEY_NAME, KEY_ROOT } from '@app/constant';
import { KeysService } from '@app/keys';
import { Inject, Injectable } from '@nestjs/common';
import {
    decode,
    JsonWebTokenError,
    NotBeforeError,
    sign,
    TokenExpiredError,
    verify,
    VerifyErrors,
} from 'jsonwebtoken';

export type VerifyReturn = {
    fail: boolean;
    reason?: string;
    name?: string;
};

@Injectable()
export class JwtService {
    private pub: string;
    private pri: string;
    constructor(private keyService: KeysService) {
        this.pub = this.keyService.jwt.pub;
        this.pri = this.keyService.jwt.pri;
    }
    sign(payload: Record<string, any>, expiresIn: string) {
        return sign(payload, this.pri, {
            algorithm: 'ES256',
            expiresIn,
        });
    }
    verify(token: string) {
        const res: VerifyReturn = {
            fail: false,
        };
        try {
            verify(token, this.pub, {
                algorithms: ['ES256'],
            });
        } catch (e) {
            const err = e as VerifyErrors;
            res.fail = true;
            res.name = err.name;
            if (err instanceof JsonWebTokenError) {
                res.reason = err.message;
            }
            if (err instanceof TokenExpiredError) {
                res.reason = `Token Expire At ${err.expiredAt.getTime()}`;
            }
            if (err instanceof NotBeforeError) {
                res.reason = err.message;
            }
        }
        return res;
    }
    decode<T>(token: string): T {
        return decode(token, { json: true }) as T;
    }
}
