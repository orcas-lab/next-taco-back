import { ConfigService } from '@app/config';
import {
    AcceptRequestData,
    DeleteRequestData,
    ListRequestData,
    MicroService_AddRequestData,
    RefuseRequestData,
    UpdateReuqestData,
} from '@app/dto/request.dto';
import { KeypairService } from '@app/keypair';
import { Account } from '@app/schema/account.schema';
import { Requests, RequestsDocument } from '@app/schema/requests.schema';
import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { FriendsService } from 'apps/friends/src/friends.service';
import { NoticeService } from 'apps/notice/src/notice.service';
import providers from 'libs/clients-provider/src';
import { CmdProcessService } from 'libs/cmd-process/src';
import { Model, Types } from 'mongoose';
@Injectable()
export class RequestService {
    @Client(providers['FRIEND_SERVICE'])
    private friendClient: ClientGrpc;
    @Client(providers['NOTICE_SERVICE'])
    private noticeClient: ClientGrpc;

    private friendService: FriendsService;
    private noticeSerivce: NoticeService;

    private record = new Map();
    constructor(
        private keyPair: KeypairService,
        @InjectModel(Requests.name)
        private RequestsModel: Model<RequestsDocument>,
        private config: ConfigService,
        private cmdProcess: CmdProcessService,
    ) {
        this.friendService = this.friendClient.getService(FriendsService.name);
        this.noticeSerivce = this.noticeClient.getService(NoticeService.name);
        this.record.set('friend', this.friendService);
        this.record.set('notice', this.noticeSerivce);
    }
    async add(data: MicroService_AddRequestData) {
        const { sender, reciver, meta, cmd } = data;
        const sign = this.keyPair.sign(data, true);
        const request = new this.RequestsModel();
        request.sender = sender;
        request.reciver = reciver;
        request.meta = meta;
        request.cmd = cmd;
        request.sign = sign;
        request.rid = new Types.ObjectId().toHexString();
        await request.save();
        return true;
    }
    async delete(data: DeleteRequestData) {
        await this.RequestsModel.findOneAndDelete({ rid: data.rid }).exec();
        return true;
    }
    async update(data: UpdateReuqestData) {
        await this.RequestsModel.findOneAndUpdate(
            {
                rid: data.rid,
            },
            {
                $set: data.req,
            },
        ).exec();
        return true;
    }
    async listReuqests(data: ListRequestData) {
        const { tid, page } = data;
        const skip =
            (page - 1) * this.config.get<'requests.size'>('requests.size') ??
            10;
        const limit = this.config.get<'requests.size'>('requests.size') ?? 10;
        return await this.RequestsModel.aggregate<{
            rid: string;
            tid: string;
            nick: string;
        }>([
            {
                $match: {
                    sender: tid,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
            {
                $lookup: {
                    from: Account.name.toLowerCase(),
                    as: 'result',
                    localField: 'reciver',
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
                    rid: 1,
                },
            },
        ]).exec();
    }
    async accept(data: AcceptRequestData) {
        const { rid } = data;
        const request = await this.RequestsModel.findOne({ rid })
            .lean<Requests>()
            .exec();
        const { sender: source, reciver: target, cmd } = request;
        const cmdObjects = this.cmdProcess.get(cmd);
        for (const cmdObject of cmdObjects) {
            const { module, action } = cmdObject;
            if (!this.record.has(module)) {
                continue;
            }
            const m: new () => void = this.record.get(module);
            if (action in m.prototype) {
                await m[action]({ source, target });
            }
        }
        await this.RequestsModel.findOneAndRemove({ rid }).exec();
        return true;
    }
    async refuse(data: RefuseRequestData) {
        const { rid } = data;
        const request = await this.RequestsModel.findOneAndRemove({ rid })
            .lean<Requests>()
            .exec();
        const { sender, reciver } = request;
        const noticeService: NoticeService = this.record.get('notice');
        await noticeService.createNotice({
            sender,
            reciver,
            message: `REQUEST_REFUSE`,
            group: false,
            action: null,
        });
        return true;
    }
}
