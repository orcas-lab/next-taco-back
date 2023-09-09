import { ConfigService } from '@app/config';
import {
    AcceptFriendRequestData,
    GetFriendListData,
} from '@app/dto/friends.dto';
import { GetFriendListResponse } from '@app/dto/response/micro-service/friends.response';
import { Friend } from '@app/interface/friends.interface';
import { Account, AccountDocument } from '@app/schema/account.schema';
import { Friends, FriendsDocument } from '@app/schema/friends.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isEmpty } from 'ramda';

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(Friends.name) private Friends: Model<FriendsDocument>,
        @InjectModel(Account.name) private Account: Model<AccountDocument>,
        private config: ConfigService,
    ) {}
    async getFriendList(
        data: GetFriendListData,
    ): Promise<GetFriendListResponse> {
        const size = this.config.get<'friends.size'>('friends.size') ?? 1000;
        const { friend_total } = await this.Account.findOne(
            { tid: data.tid },
            { friend_total: 1 },
        ).findOne();
        const friends = await this.Friends.aggregate<Friend>([
            {
                $match: {
                    source: data.tid,
                },
            },
            {
                $limit: size,
            },
            {
                $skip: (data.page - 1) * size,
            },
            {
                $lookup: {
                    from: Account.name.toLowerCase(),
                    as: 'friends',
                    localField: 'target',
                    foreignField: 'tid',
                },
            },
            {
                $project: {
                    friends: {
                        friend_total: 0,
                        password: 0,
                    },
                },
            },
        ]);
        const page = Math.floor(friend_total / size);
        return { friends, total: friend_total, page };
    }
    async _isFriend(source: string, target: string) {
        return !isEmpty(await this.Friends.findOne({ source, target }).exec());
    }
    async accept(data: AcceptFriendRequestData) {
        const { source, target } = data;
        if (this._isFriend(source, target)) {
            return true;
        }
        const friend = new this.Friends();
        friend.source = source;
        friend.target = target;
        await friend.save();
        return true;
    }
    async refuse() {
        return true;
    }
}
