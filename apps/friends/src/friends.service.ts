import { ConfigService } from '@app/config';
import {
    AcceptFriendRequestData,
    DeleteFriendData,
    GetFriendListData,
} from '@app/dto/friends.dto';
import { GetFriendListResponse } from '@app/dto/response/micro-service/friends.response';
import { MicroserviceErrorTable } from '@app/errors/microservice.error';
import { Friend } from '@app/interface/friends.interface';
import { Account, AccountDocument } from '@app/schema/account.schema';
import { BlackList, BlackListDocument } from '@app/schema/black-list.schema';
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
        @InjectModel(BlackList.name)
        private BlackList: Model<BlackListDocument>,
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
        const friends = (
            await this.Friends.aggregate<{ friends: Friend[] }>([
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
                            _id: 0,
                            __v: 0,
                        },
                    },
                },
            ])
        )
            .map((v) => v.friends)
            .reduce((pre, cur) => [...pre, ...cur]);
        const page = Math.floor(friend_total / size);
        return { friends, total: friend_total, page: page + 1 };
    }
    async _isFriend(source: string, target: string) {
        return isEmpty(await this.Friends.findOne({ source, target }).exec());
    }
    async accept(data: AcceptFriendRequestData) {
        const { source, target } = data;
        if (this._isFriend(source, target)) {
            return true;
        }
        const friends = [new this.Friends(), new this.Friends()];
        friends[0].source = source;
        friends[0].target = target;
        friends[1].source = target;
        friends[1].target = source;
        const session = await this.Friends.db.startSession();
        session.startTransaction();
        try {
            session.withTransaction(async (session) => {
                for (let i = 0; i < friends.length; i++) {
                    await friends[i].save({ session });
                }
                await this.Account.findOneAndUpdate(
                    { tid: data.source },
                    { $inc: { friend_total: 1 } },
                    { session },
                ).exec();
                await this.Account.findOneAndUpdate(
                    { tid: data.target },
                    { $inc: { friend_total: 1 } },
                    { session },
                ).exec();
            });
        } catch {
            session.endSession();
            throw MicroserviceErrorTable.ACCEPT_ADD_FRIEND_REQUEST_FAIL;
        }
        return true;
    }
    async refuse() {
        return true;
    }
    async deleteFriend(data: DeleteFriendData) {
        const session = await this.Account.db.startSession();
        try {
            await session.withTransaction(async (session) => {
                await this.Friends.findOneAndDelete(
                    {
                        source: data.target,
                        target: data.source,
                    },
                    { session },
                ).exec();
                await this.Friends.findOneAndDelete(
                    {
                        source: data.source,
                        target: data.target,
                    },
                    { session },
                );
                if (data.black_list) {
                    const blackList = new this.BlackList();
                    blackList.source = data.source;
                    blackList.target = data.target;
                    await blackList.save({ session });
                }
            });
            await session.commitTransaction();
        } catch (e) {
            await session.abortTransaction();
            throw MicroserviceErrorTable.DELETE_FRIEND_REQUEST_FAIL;
        } finally {
            await session.endSession();
        }
        return true;
    }
}
