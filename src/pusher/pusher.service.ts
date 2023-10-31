import { Injectable } from '@nestjs/common';
import { Message as MessageDTO } from './dto/pusher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '@app/entity';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
@Injectable()
export class PusherService {
    constructor(
        @InjectRepository(Message)
        private Message: Repository<Message>,
    ) {}
    persistence(data: MessageDTO & { source: string }) {
        const msg = new Message();
        msg.sender = data.source;
        msg.target = data.target;
        msg.msg = data.msg;
        msg.uuid = randomUUID();
        return this.Message.save(msg);
    }
}
