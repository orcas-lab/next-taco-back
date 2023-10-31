import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PusherService } from './pusher.service';
import { Message } from './dto/pusher.dto';
import { UseGuards } from '@nestjs/common';
import { User } from '../user.decorator';
import { WsAuthGuard } from '@app/shared/ws-auth.guard';
import { IsFriendGuard } from '@app/shared/is-friend.guard';

@WebSocketGateway(3001, { namespace: 'ws' })
export class PusherGateway {
    @WebSocketServer()
    server: Server;
    private sockets: Map<string, Socket> = new Map();
    constructor(private readonly pusherService: PusherService) {}
    @UseGuards(WsAuthGuard, IsFriendGuard)
    @SubscribeMessage('message')
    async sendMessage(
        @MessageBody() data: Message,
        @User('tid') source: string,
    ) {
        const msg = await this.pusherService.persistence({ ...data, source });
        this.server.to(`${data.target}:${source}`).emit('msg', msg);
        return msg;
    }
}
