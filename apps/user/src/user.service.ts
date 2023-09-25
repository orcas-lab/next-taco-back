import { UpdateProfile } from '@app/dto/user.dto';
import { MicroserviceErrorTable } from '@app/errors/microservice.error';
import { Profile } from '@app/interface/profile.interface';
import { Account, AccountDocument } from '@app/schema/account.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { omit } from 'ramda';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Account.name)
        private accountDocument: Model<AccountDocument>,
    ) {}
    async profile(tid: string) {
        const profile = await this.accountDocument
            .findOne(
                {
                    tid: tid,
                },
                {
                    tid: 1,
                    nick: 1,
                    description: 1,
                    email: 1,
                    sex: 1,
                    location: 1,
                    reputation: 1,
                },
            )
            .lean<Profile>()
            .exec();
        if (!profile) {
            throw MicroserviceErrorTable.ACCOUNT_NOT_EXISTS;
        }
        return profile;
    }

    async updateProfile(data: UpdateProfile) {
        const { tid, profile } = data;
        const newProfile = omit(['reputation', 'tid'], profile);
        await this.accountDocument
            .findOneAndUpdate({ tid }, { $set: { profile: newProfile } })
            .lean()
            .exec();
        return true;
    }
}
