import { ConfigService } from '@app/config';
import {
    AppendToBlackList,
    DeleteBlackList,
    GetBlackList,
} from '@app/dto/black-list.dto';
import { MicroserviceErrorTable } from '@app/errors/microservice.error';
import { Profile } from '@app/interface/profile.interface';
import { Account, AccountDocument } from '@app/schema/account.schema';
import { BlackList, BlackListDocument } from '@app/schema/black-list.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { AccountService } from '../../account/src/account.service';
import { Model } from 'mongoose';
import { isEmpty, isNil } from 'ramda';

@Injectable()
export class BlackListService {
    private accountService: AccountService =
        this.client.getService<AccountService>(AccountService.name);
    constructor(
        @Inject('ACCOUNT_SERVICE') private client: ClientGrpc,
        @InjectModel(Account.name) private Account: Model<AccountDocument>,
        @InjectModel(BlackList.name)
        private BlackList: Model<BlackListDocument>,
        private config: ConfigService,
    ) {}
    async _hasTarget(source: string, target: string) {
        const profile = this.BlackList.findOne({ source, target }).exec();
        return !isNil(await profile);
    }
    async add(data: AppendToBlackList) {
        const { source, target } = data;
        if (!(await this.accountService.accountExists({ tid: target }))) {
            throw MicroserviceErrorTable.ACCOUNT_NOT_EXISTS;
        }
        if (this._hasTarget(source, target)) {
            return true;
        }
        const blackList = new this.BlackList();
        blackList.source = source;
        blackList.target = target;
        await blackList.save();
        return true;
    }
    async query(data: GetBlackList) {
        const { source, page } = data;
        const size = this.config.get<'blackList.size'>('blackList.size') ?? 10;
        const targets = await this.BlackList.find({ source }, { target: 1 })
            .skip((page >= 1 ? page - 1 : 0) * size)
            .lean<BlackList[]>()
            .exec();
        if (isEmpty(targets)) {
            return [];
        }
        return await this.Account.aggregate<Profile>([
            {
                $match: {
                    $or: targets.map((target) => ({
                        tid: target.target,
                    })),
                },
            },
            {
                $lookup: {
                    from: Account.name.toLowerCase(),
                    as: 'result',
                    localField: 'target',
                    foreignField: 'tid',
                },
            },
            {
                $unwind: {
                    path: '$result',
                },
            },
            {
                $project: {
                    tid: '$result.tid',
                    nick: '$result.nick',
                    description: '$result.description',
                    email: '$result.email',
                    sex: '$result.sex',
                },
            },
        ]);
    }
    async delete(data: DeleteBlackList) {
        const { source, target } = data;
        if (!this._hasTarget(source, target)) {
            return true;
        }
        await this.BlackList.findOneAndRemove({ source, target }).exec();
        return true;
    }
}
