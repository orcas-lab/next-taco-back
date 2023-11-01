import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PusherService } from './pusher.service';
import { Message } from './dto/pusher.dto';
import { Logger, UseGuards } from '@nestjs/common';
import { User } from '../user.decorator';
import { WsAuthGuard } from '@app/shared/ws-auth.guard';
import { IsFriendGuard } from '@app/shared/is-friend.guard';
import { Socket } from 'socket.io';
import { JwtService } from '@app/jwt';
import { GLOBAL, PusherError } from '@app/error';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class PusherGateway implements OnGatewayConnection<Socket> {
    @WebSocketServer()
    server: Server;
    constructor(
        private readonly pusherService: PusherService,
        private readonly jwt: JwtService,
    ) {}
    @UseGuards(IsFriendGuard)
    @SubscribeMessage('message')
    async sendMessage(
        @MessageBody() data: Message,
        @User('tid') source: string,
    ) {
        const msg = await this.pusherService.persistence({ ...data, source });
        this.server.to(`${data.target}:${source}`).emit('msg', msg);
        return msg;
    }

    handleConnection(client: Socket) {
        Logger.debug('Client connect');
        if (!client.handshake.headers.authorization) {
            client.emit('error', new PusherError(-1, 'INVALIDE_TOKEN'));
            client.disconnect(true);
            return;
        }
        const token = client.handshake.headers.authorization
            .replace('Bearer', '')
            .trim();
        try {
            this.jwt.verify(token, { algorithms: ['RS256'] });
        } catch {
            client.emit('error', new PusherError(-1, 'INVALIDE_TOKEN'));
            client.disconnect(true);
            return;
        }
    }
    @SubscribeMessage('ping')
    handlePing() {
        return {
            event: 'pong',
            data: 'pong',
        };
    }
}
