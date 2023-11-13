import { Account, createAccount } from '@app/entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    DeleteAccountRequest,
    LoginRequest,
    RegisterReuqest,
    UpdatePasswordRequest,
} from './dto/account.dto';
import { useBCrypt } from '@app/bcrypto';
import { ConfigureService } from '@app/configure';
import { equals, isNil } from 'ramda';
import { AccountError } from '@app/error';
import { JwtService } from '@app/jwt';
import { Cluster } from 'ioredis';
import { InjectCluster } from '@liaoliaots/nestjs-redis';
import { namespace } from '@app/shared';
import ms from 'ms';
import { Profile, createProfile } from '@app/entity/profile.entity';

@Injectable()
export class AccountService {
    constructor(
        @InjectCluster()
        private cluster: Cluster,
        @InjectRepository(Account)
        private readonly account: Repository<Account>,
        @InjectRepository(Profile)
        private readonly Profile: Repository<Profile>,
        private readonly config: ConfigureService,
        private readonly jwt: JwtService,
    ) {}
    async register(data: RegisterReuqest) {
        const userExists = await this.userExists(data.tid);
        const defaultReputation = this.config.get('user.default_reputation');
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
        const profile = createProfile({
            ...data,
            reputation: defaultReputation ?? 5,
        });
        await this.Profile.save(profile);
        return this.account.save(account);
    }
    async delete(data: DeleteAccountRequest & { tid: string }) {
        const accountExists = this.userExists(data.tid);
        if (!(await accountExists)) {
            throw AccountError.ACCOUNT_NOT_EXISTS;
        }
        const questionValide = this.checkQuestion(data);
        if (await questionValide) {
            await this.account.delete({
                tid: data.tid,
            });
            await this.revokeToken(data);
            return;
        }
        throw AccountError.QUESTION_INVALIDE;
    }

    async updatePassword(data: UpdatePasswordRequest & { tid: string }) {
        const userExists = this.userExists(data.tid);
        if (!(await userExists)) {
            throw AccountError.ACCOUNT_NOT_EXISTS;
        }
        const questionValide = this.checkQuestion(data);
        if (!(await questionValide)) {
            throw AccountError.QUESTION_INVALIDE;
        }
        const password = useBCrypt(
            data.password,
            this.config.get('bcrypt.salt'),
            this.config.get('bcrypt.cost'),
        );
        await this.account.update(
            {
                tid: data.tid,
            },
            {
                password,
            },
        );
        await this.revokeToken(data);
    }
    async login(data: LoginRequest) {
        const isExists = await this.userExists(data.tid);
        if (!isExists) {
            throw AccountError.ACCOUNT_NOT_EXISTS;
        }
        const account = await this.account.findOne({
            where: {
                tid: data.tid,
                active: true,
            },
            select: {
                tid: true,
                password: true,
            },
        });
        if (
            account.password !==
            useBCrypt(
                data.password,
                this.config.get('bcrypt.salt'),
                this.config.get('bcrypt.cost'),
            )
        ) {
            throw AccountError.TID_OR_PASSWORD_ERROR;
        }
        const access_token = this.jwt.sign(
            { ...account },
            {
                algorithm: 'RS256',
                expiresIn: '1d',
            },
        );
        const refresh_token = this.jwt.sign(
            { ...account },
            {
                algorithm: 'RS256',
                expiresIn: '2 days',
            },
        );
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
    private async checkQuestion(data: {
        tid: string;
        question: { [x: string]: any };
    }) {
        const accountInfo = this.account.findOne({
            where: {
                tid: data.tid,
            },
        });
        return equals((await accountInfo).question, data.question);
    }
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
    private async revokeToken(data: { tid: string }) {
        const ns = {
            access_token: namespace.TOKEN('access', data.tid),
            refresh_token: namespace.TOKEN('refresh', data.tid),
        };
        await this.cluster.del(ns.access_token);
        await this.cluster.del(ns.refresh_token);
    }
}
