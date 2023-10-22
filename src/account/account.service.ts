import { Account, createAccount } from '@app/entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginRequest, RegisterReuqest } from './dto/account.dto';
import { useBCrypt } from '@app/bcrypto';
import { ConfigureService } from '@app/configure';
import { isEmpty, isNil } from 'ramda';
import { AccountError } from '@app/error';
import { JwtService } from '@app/jwt';
import { Cluster } from 'ioredis';
import { InjectCluster } from '@liaoliaots/nestjs-redis';
import { namespace } from '@app/shared';
import ms from 'ms';

@Injectable()
export class AccountService {
    constructor(
        @InjectCluster()
        private cluster: Cluster,
        @InjectRepository(Account)
        private readonly account: Repository<Account>,
        private readonly config: ConfigureService,
        private readonly jwt: JwtService,
    ) {}
    private async userExists(tid: string) {
        const account = await this.account.findOne({
            where: {
                tid,
            },
            select: {
                tid: true,
            },
        });
        return !isNil(account);
    }
    async register(data: RegisterReuqest) {
        const userExists = await this.userExists(data.tid);
        if (userExists) {
            throw AccountError.ACCOUNT_EXISTS;
        }
        const account = createAccount({
            ...data,
            password: useBCrypt(
                data.password,
                this.config.get('bcrypt.salt'),
                this.config.get('bcrypt.cost'),
            ),
        });
        return this.account.save(account);
    }
    async login(data: LoginRequest) {
        const isExists = await this.userExists(data.tid);
        if (!isExists) {
            throw AccountError.ACCOUNT_NOT_EXISTS;
        }
        const account = await this.account.findOne({
            where: {
                tid: data.tid,
                password: useBCrypt(
                    data.password,
                    this.config.get('bcrypt.salt'),
                    this.config.get('bcrypt.cost'),
                ),
                active: true,
            },
            select: {
                tid: true,
            },
        });
        if (isEmpty(account)) {
            throw AccountError.TID_OR_PASSWORD_ERROR;
        }
        const access_token = this.jwt.sign(account, {
            algorithm: 'RS256',
            expiresIn: '1d',
        });
        const refresh_token = this.jwt.sign(account, {
            algorithm: 'RS256',
            expiresIn: '2 days',
        });
        const ns = {
            access_token: namespace.TOKEN('access', account.tid),
            refresh_token: namespace.TOKEN('refresh', account.tid),
        };
        await this.cluster.set(ns.access_token, access_token);
        await this.cluster.set(ns.refresh_token, refresh_token);
        await this.cluster.expire(
            ns.access_token,
            parseInt(String(ms('1d') / 1000)),
        );
        await this.cluster.expire(
            ns.refresh_token,
            parseInt(String(ms('2 days') / 1000)),
        );
        return { access_token, refresh_token };
    }
}
