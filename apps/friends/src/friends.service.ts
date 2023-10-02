import { ConfigService } from '@app/config';
import {
    AcceptFriendRequestData,
    DeleteFriendData,
    GetFriendListData,
    UpdateFriendInfo,
} from '@app/dto/friends.dto';
import { GetFriendListResponse } from '@app/dto/response/micro-service/friends.response';
import { MicroserviceErrorTable } from '@app/errors/microservice.error';
import { Friend } from '@app/interface/friends.interface';
import { Profile } from '@app/interface/profile.interface';
import { Account, AccountDocument } from '@app/schema/account.schema';
import { BlackList, BlackListDocument } from '@app/schema/black-list.schema';
import { Friends, FriendsDocument } from '@app/schema/friends.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { filter, isEmpty, omit } from 'ramda';

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
            await this.Friends.aggregate<{
                profile: Profile;
                tag: string;
                pet_name: string;
            }>([
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
                        as: 'profile',
                        localField: 'target',
                        foreignField: 'tid',
                    },
                },
                {
                    $project: {
                        tag: 1,
                        pet_name: 1,
                        profile: {
                            tid: 1,
                            nick: 1,
                            description: 1,
                            email: 1,
                            sex: 1,
                            location: 1,
                            reputation: 1,
                        },
                    },
                },
                {
                    $unwind: '$profile',
                },
            ])
        ).map<Friend>((v) => {
            return {
                profile: v['profile'],
                tag: v['tag'],
                pet_name: v['pet_name'] ?? v['profile']['nick'],
            };
        });
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
        if (this._isFriend(data.source, data.target)) {
            throw MicroserviceErrorTable.NOT_FRIEND;
        }
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
    async update(data: UpdateFriendInfo) {
        const { source, target } = data;
        let update = filter((v) => !isEmpty(v))(data as Record<string, any>);
        update = omit(['source', 'target'])(update);
        if (isEmpty(update)) {
            return true;
        }
        await this.Friends.findOneAndUpdate(
            {
                source,
                target,
            },
            {
                $set: {
                    ...update,
                },
            },
        ).exec();
        return true;
    }
}
