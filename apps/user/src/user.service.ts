import { UpdateProfile } from '@app/dto/user.dto';
import { Profile } from '@app/interface/profile.interface';
import { Account, AccountDocument } from '@app/schema/account.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Account.name)
        private accountDocument: Model<AccountDocument>,
    ) {}
    async profile(tid: string) {
        return await this.accountDocument
            .findOne(
                { tid },
                {
                    tid: 1,
                    nick: 1,
                    description: 1,
                    email: 1,
                    sex: 1,
                    location: 1,
                },
            )
            .lean<Profile>()
            .exec();
    }

    async updateProfile(data: UpdateProfile) {
        const { tid, profile } = data;
        await this.accountDocument
            .findOneAndUpdate({ tid }, { $set: { profile } })
            .lean()
            .exec();
        return true;
    }
}
