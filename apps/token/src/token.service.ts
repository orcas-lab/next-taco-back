import { ConfigService } from '@app/config';
import { EstablishToken, TokenPair } from '@app/dto';
import { MicroserviceErrorTable } from '@app/errors/microservice.error';
import { JwtService } from '@app/jwt';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';
import { NameSpace } from '@app/utils';
import { omit } from 'ramda';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
        @InjectRedis()
        private readonly redis: Redis,
    ) {}
    async sign(data: Record<string, any>): Promise<TokenPair> {
        const access_token = await this.jwt.sign(data, {
            expiresIn:
                this.config.get<'key.access_token.expire'>(
                    'key.access_token.expire',
                ) ?? '7d',
            algorithm: 'ES512',
        });
        const refresh_token = await this.jwt.sign(
            { access_token },
            {
                expiresIn:
                    this.config.get<'key.refresh_token.expire'>(
                        'key.refresh_token.expire',
                    ) ?? '30d',
                algorithm: 'ES512',
            },
        );
        return { access_token, refresh_token };
    }
    async verify(pair: TokenPair) {
        return this.jwt
            .verify(pair.access_token)
            .then(() => true)
            .catch(() => false);
    }
    async refresh(pair: TokenPair) {
        const oldAccess = pair.access_token;
        const access_token = this.jwt
            .verify(oldAccess)
            .then((access_token) => access_token)
            .catch((err) => {
                if (err.name === 'TokenExpiredError') {
                    return this.jwt.decode(oldAccess, {
                        complete: true,
                    });
                }
                throw MicroserviceErrorTable.TOKEN_INVALIDATE;
            })
            .then((v) => {
                return this.jwt.sign(omit(['exp', 'iat'])(v), {
                    expiresIn:
                        this.config.get<'key.access_token.expire'>(
                            'key.access_token.expire',
                        ) ?? '7d',
                    algorithm: 'ES512',
                });
            });
        const refresh_token = this.jwt
            .sign(
                { access_token: await access_token },
                {
                    expiresIn:
                        this.config.get<'key.refresh_token.expire'>(
                            'key.refresh_token.expire',
                        ) ?? '30d',
                    algorithm: 'ES512',
                },
            )
            .then((token) => token)
            .catch((reason) => {
                console.log(reason);
            });
        return {
            access_token: await access_token,
            refresh_token: await refresh_token,
        };
    }
    async decode(access_token: string) {
        return this.jwt.decode(access_token, { json: true });
    }
    async revoke(tid: string) {
        await this.redis.del(NameSpace.TOKEN(tid));
        return true;
    }
    async establish(data: EstablishToken) {
        const { access_token, tid } = data;
        await this.redis.set(NameSpace.TOKEN(tid), access_token);
        return true;
    }
}
