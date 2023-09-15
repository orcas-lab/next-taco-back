import {
    Register,
    ChnagePassword,
    DeleteAccount,
    AccountExists,
    AccountOnline,
    KickAccount,
} from '@app/dto';
import { AccountRegisterServiceResponse } from '@app/dto/response/micro-service/account.response';
import { MicroserviceErrorTable } from '@app/errors/microservice.error';
import { Account, AccountDocument } from '@app/schema/account.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Model } from 'mongoose';
import { isEmpty } from 'ramda';
import { ConfigService } from '@app/config';
import { NameSpace } from '@app/utils';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class AccountService {
    constructor(
        @InjectModel(Account.name)
        private readonly accountModel: Model<AccountDocument>,
        private readonly config: ConfigService,
        @InjectRedis() private redis: Redis,
    ) {}
    async addUser(dto: Register): Promise<AccountRegisterServiceResponse> {
        const { tid } = dto;
        if (!isEmpty((await this.accountModel.findOne({ tid }).exec()) ?? [])) {
            throw MicroserviceErrorTable.TID_EXISTS;
        }
        await this.accountModel.insertMany([
            {
                ...dto,
                reputation:
                    this.config.get<'account.reputation.default'>(
                        'account.reputation.default',
                    ) ?? 5,
                password: createHash('sha256')
                    .update(dto.password)
                    .digest('hex'),
            },
        ]);
        return true;
    }
    async accountExists(data: AccountExists): Promise<boolean> {
        const { tid, password } = data;
        const findCondition = password
            ? {
                  tid,
                  password: createHash('sha256').update(password).digest('hex'),
              }
            : { tid };
        const info = await this.accountModel
            .findOne(findCondition, { _id: 1 })
            .exec();
        return !isEmpty(info ?? {});
    }
    async changePassword(dto: ChnagePassword) {
        await this.accountModel
            .findOneAndUpdate(
                { tid: dto.tid },
                { $set: { password: dto.new_pass } },
            )
            .exec();
        return true;
    }
    async deleteAccount(dto: DeleteAccount) {
        await this.accountModel.findOneAndRemove({ tid: dto.tid }).exec();
        return true;
    }
    async online(data: AccountOnline) {
        const ns = NameSpace.TOKEN(data.tid);
        return Boolean(await this.redis.exists(ns));
    }
    async kick(data: KickAccount) {
        const ns = NameSpace.TOKEN(data.tid);
        await this.redis.del(ns);
        return true;
    }
}
