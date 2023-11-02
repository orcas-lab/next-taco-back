import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Message } from '../../../src/pusher/dto/pusher.dto';
import { Socket } from 'socket.io';
import { Handshake } from 'socket.io/dist/socket';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from '@app/entity';
import { DataSource, Repository } from 'typeorm';
import { isNil, or } from 'ramda';
import { PUSHER_ERROR } from '@app/error';

@Injectable()
export class IsFriendGuard implements CanActivate {
    constructor(
        @InjectRepository(Friend)
        private readonly Friend: Repository<Friend>,
        private readonly dataSource: DataSource,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ws = context.switchToWs();
        const data = ws.getData<Message>();
        const client = ws.getClient<Socket>();
        const user = (client.handshake as Handshake & { user: User }).user;
        const source = user.tid;
        const target = data.target;
        const stack = [
            this.Friend.findOne({ where: { source, target } }),
            this.Friend.findOne({ where: { source: target, target: source } }),
        ];
        const status = Promise.all(stack)
            .then((datas) => or(!isNil(datas[0]), !isNil(datas[1])))
            .catch(() => false);
        if (!(await status)) {
            throw PUSHER_ERROR.IS_NOT_FRIEND;
        }
        return true;
    }
}
