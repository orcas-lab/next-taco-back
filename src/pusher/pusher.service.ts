import { Injectable } from '@nestjs/common';
import { Message as MessageDTO } from './dto/pusher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '@app/entity';
import { randomUUID } from 'crypto';
import { KeysService } from '@app/keys';
@Injectable()
export class PusherService {
  constructor(
    @InjectRepository(Message)
    private Message: Repository<Message>,
    private keyService: KeysService,
  ) {}
  persistence(data: MessageDTO & { source: string }) {
    const msg = new Message();
    msg.sender = data.source;
    msg.target = data.target;
    msg.msg = data.msg;
    msg.uuid = randomUUID();
    msg.sender_sign = data.senderSign;
    msg.server_sign = this.keyService.sign(data.msg);
    return this.Message.save(msg);
  }
}
