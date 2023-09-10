import { ConfigService } from '@app/config';
import {
    DeleteRequestData,
    ListRequestData,
    MicroService_AddRequestData,
    UpdateReuqestData,
} from '@app/dto/request.dto';
import { KeypairService } from '@app/keypair';
import { Account } from '@app/schema/account.schema';
import { Requests, RequestsDocument } from '@app/schema/requests.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class RequestService {
    constructor(
        private keyPair: KeypairService,
        @InjectModel(Requests.name)
        private RequestsModel: Model<RequestsDocument>,
        private config: ConfigService,
    ) {}
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
}
