import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Message } from '../../../src/pusher/dto/pusher.dto';
import { Socket } from 'socket.io';
import { Handshake } from 'socket.io/dist/socket';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from '@app/entity';
import { DataSource, Repository } from 'typeorm';
import { and, isNil, or, pipe, reduceRight } from 'ramda';

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
        return Promise.all(stack)
            .then((datas) => or(isNil(datas[0]), isNil(datas[1])))
            .catch(() => false);
    }
}
