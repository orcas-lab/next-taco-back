import { ConfigService } from '@app/config';
import {
    ListNoticesRequest,
    CreateNoticeRequest,
    DeleteNoticeReuqest,
    UpdateNoticeRequest,
} from '@app/dto/notice.dto';
import { Notice } from '@app/interface/notice.interface';
import { KeypairService } from '@app/keypair';
import { NameSpace } from '@app/utils';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Types } from 'mongoose';

@Injectable()
export class NoticeService {
    constructor(
        @InjectRedis() private redis: Redis,
        private config: ConfigService,
        private keyPair: KeypairService,
    ) {}
    async getRank(nid: string) {
        return (await this.redis.hget(NameSpace.NOTICE_RECORD(), nid)).split(
            ',',
        );
    }
    async setRank(nid: string, rank: string, ns: string) {
        await this.redis.hset(NameSpace.NOTICE_RECORD(), {
            [nid]: `${ns},${rank}`,
        });
        return true;
    }
    async createNotice(data: CreateNoticeRequest) {
        const { sender, reciver, group, message, action } = data;
        const ns = NameSpace.NOTICE(reciver);
        const notice = new Notice();
        notice.sender = sender;
        notice.reciver = reciver;
        notice.group = group;
        notice.message = message;
        notice.action = action;
        const signature = this.keyPair.sign(JSON.stringify(notice));
        notice.sign = signature;
        notice.nid = new Types.ObjectId().toHexString();
        const len = await this.redis.zcard(ns);
        await this.redis.zadd(ns, len + 1, JSON.stringify(notice));
        await this.redis.hset(NameSpace.NOTICE_RECORD(), {
            [notice.nid]: `${ns},${len + 1}`,
        });
        return notice;
    }
    async deleteNotice(data: DeleteNoticeReuqest) {
        const { nid } = data;
        const [ns, rank] = await this.getRank(nid);
        await this.redis.zremrangebyrank(ns, rank, rank);
        await this.redis.hdel(NameSpace.NOTICE_RECORD(), nid);
        return;
    }
    async updateNotice(data: UpdateNoticeRequest) {
        const { notice, nid } = data;
        const [ns, rank] = await this.getRank(nid);
        const rawNotice = JSON.parse(
            (
                await this.redis.zrange(ns, Number(rank) - 1, Number(rank) - 1)
            )[0] ?? '{}',
        ) as Notice;
        await this.redis.zremrangebyrank(
            ns,
            Number(rank) - 1,
            Number(rank) - 1,
        );
        const pubNotice = new Notice();
        pubNotice.sender = notice.sender ?? rawNotice.sender;
        pubNotice.reciver = notice.reciver ?? rawNotice.reciver;
        pubNotice.message = notice.message ?? rawNotice.message;
        pubNotice.group = notice.group ?? rawNotice.group;
        pubNotice.nid = nid;
        pubNotice.action = notice.action ?? rawNotice.action;
        pubNotice.sign = this.keyPair.sign(JSON.stringify(pubNotice));
        await this.redis.zadd(ns, Number(rank) - 1, JSON.stringify(pubNotice));
        await this.setRank(nid, rank.toString(), ns);
    }
    async listNotice(data: ListNoticesRequest) {
        const { tid, page } = data;
        const ns = NameSpace.NOTICE(tid);
        const limit = this.config.get<'notices.size'>('notices.size') ?? 10;
        const start = page - 1 * limit;
        const end = page * limit;
        const notices = (
            await this.redis.zrange(ns, start, end)
        ).map<CreateNoticeRequest>((v) => JSON.parse(v));
        await this.redis.zremrangebyrank(ns, start, end);
        const total = await this.redis.zcard(ns);
        return { notices, pages: Math.floor(total / limit) };
    }
}
