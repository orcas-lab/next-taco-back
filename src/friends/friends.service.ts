import { Injectable } from '@nestjs/common';
import {
    AddFriend,
    DeleteFriend,
    UpdateFriend,
    Accept,
    Reject,
} from './dto/friend.rquest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlackList, Friend, Profile, Request } from '@app/entity';
import { Repository } from 'typeorm';
import { ConfigureService } from '@app/configure';
import ms from 'ms';
import { randomUUID } from 'crypto';
import { isNil } from 'ramda';
import { FriendError } from '@app/error';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(Profile)
        private readonly Profile: Repository<Profile>,
        @InjectRepository(Request)
        private readonly Request: Repository<Request>,
        @InjectRepository(Friend)
        private readonly Friend: Repository<Friend>,
        @InjectRepository(BlackList)
        private readonly BlackList: Repository<BlackList>,
        private readonly configure: ConfigureService,
    ) {}
    async sendAddFriendRequest(data: AddFriend & { source: string }) {
        const req = new Request();
        req.source = data.source;
        req.target = data.target;
        const expire = this.configure.get('request.expire') ?? ms('7 days');
        const timestamp = new Date().getTime();
        req.expire_at = timestamp + expire;
        req.create_at = timestamp;
        req.update_at = timestamp;
        const worker_id = this.configure.get('worker_id') ?? 0;
        req.worker_id = worker_id;
        req.uuid = randomUUID();
        await this.Request.save(req);
        return { rid: req.uuid };
    }
    async deleteFriend(data: DeleteFriend & { source: string }) {
        if (data.type === 'single') {
            await this.Friend.delete({
                source: data.source,
                target: data.target,
            });
            await this.Profile.decrement(
                { tid: data.source },
                'friends_total',
                1,
            );
        }
        if (data.type === 'both') {
            await this.deleteFriend({ ...data, type: 'single' });
            await this.deleteFriend({
                source: data.target,
                target: data.source,
                type: 'single',
            });
        }
        if (data.ban) {
            const blackList = new BlackList();
            blackList.source = data.source;
            blackList.target = data.target;
            blackList.id = randomUUID();
            const time = new Date().getTime();
            blackList.create_at = time;
            blackList.update_at = time;
            this.BlackList.save(blackList);
        }
        return;
    }
    async updateFriend(data: UpdateFriend & { source: string }) {
        await this.Friend.update(
            {
                source: data.source,
                target: data.target,
            },
            { tag: data.tag, nick: data.nick },
        );
        return;
    }
    async getFriends(tid: string, offset: number) {
        const friends = await this.Friend.find({
            where: {
                source: tid,
            },
            skip: offset,
            take: 100,
            relations: ['profile'],
        });
        const profile = await this.Profile.findOne({
            where: {
                tid,
            },
            select: {
                friends_total: true,
            },
        });
        return {
            friends: friends ?? [],
            total: profile.friends_total,
            size: 100,
        };
    }
    async accept(data: Accept, tid: string) {
        const { rid } = data;
        const requestCheckStatus = await this.isRequestValide(rid);
        if (requestCheckStatus === 'IS_EXPIRED') {
            throw FriendError.REQUEST_EXPIRED;
        }
        if (requestCheckStatus === 'IS_NIL') {
            throw FriendError.CAN_NOT_FIND_REQ;
        }
        const { source, target } = await this.Request.findOne({
            where: {
                uuid: rid,
            },
            select: {
                source: true,
                target: true,
            },
        });
        if (source === tid) {
            throw FriendError.UNABLE_TO_PROCESS_OWNS_REQUEST;
        }
        await this.addFriend(source, target);
        await this.addFriend(target, source);
        await this.Request.delete({
            source,
            target,
        });
        return;
    }
    async reject(data: Reject, tid: string) {
        const { rid } = data;
        const requestCheckStatus = await this.isRequestValide(rid);
        if (requestCheckStatus === 'IS_EXPIRED') {
            throw FriendError.REQUEST_EXPIRED;
        }
        if (requestCheckStatus === 'IS_NIL') {
            throw FriendError.CAN_NOT_FIND_REQ;
        }
        const { source, target } = await this.Request.findOne({
            where: {
                uuid: rid,
            },
            select: {
                source: true,
                target: true,
            },
        });
        if (source === tid) {
        }
        await this.Request.delete({
            source,
            target,
        });
    }
    private async addFriend(source: string, target: string) {
        const friend = new Friend();
        const time = new Date().getTime();
        friend.source = source;
        friend.target = target;
        friend.tag = '';
        friend.create_at = time;
        friend.update_at = time;
        friend.nick = '';
        friend.uuid = randomUUID();
        await this.Friend.save(friend, { transaction: true });
        return;
    }
    private async isRequestValide(rid: string) {
        const req = this.Request.findOne({ where: { uuid: rid } });
        const time = new Date().getTime();
        if (isNil(await req)) {
            return 'IS_NIL';
        }
        const isExpired = time > (await req).expire_at;
        if (isExpired) {
            return 'IS_EXPIRED';
        }
        return '';
    }
}
