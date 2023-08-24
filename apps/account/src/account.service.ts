import { Register, Login, ChnagePassword } from '@app/dto';
import {
    AccountExistsServiceResponse,
    AccountRegisterServiceResponse,
} from '@app/dto/response/micro-service/account.response';
import { MicroserviceErrorTable } from '@app/errors/microservice.error';
import { Profile } from '@app/interface/profile.interface';
import { Account, AccountDocument } from '@app/schema/account.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Model } from 'mongoose';
import { isEmpty } from 'ramda';
import { ConfigService } from '@app/config';

@Injectable()
export class AccountService {
    constructor(
        @InjectModel(Account.name)
        private readonly accountModel: Model<AccountDocument>,
        private readonly config: ConfigService,
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
    async accountExists(dto: Login): Promise<AccountExistsServiceResponse> {
        const accountLoginData = {
            ...dto,
            password: createHash('sha256').update(dto.password).digest('hex'),
        };
        const info = await this.accountModel
            .findOne(accountLoginData, {
                tid: 1,
                nick: 1,
                description: 1,
                email: 1,
                sex: 1,
                location: 1,
            })
            .lean<Profile>()
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
}
