import { ConfigService } from '@app/config';
import { ChangeReputation } from '@app/dto';
import { Account, AccountDocument } from '@app/schema/account.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReputationService {
    constructor(
        @InjectModel(Account.name)
        private readonly accountModel: Model<AccountDocument>,
        private readonly config: ConfigService,
    ) {}
    async changeReputation(data: ChangeReputation) {
        let step = this.config.get<'reputation.step'>('reputation.step');
        const { tid, up } = data;
        if (!up) {
            step *= -1;
        }
        await this.accountModel
            .findOneAndUpdate({ tid }, { $inc: { reputation: step } })
            .exec();
        return true;
    }
}
