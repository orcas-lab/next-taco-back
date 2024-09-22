import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PusherService } from './pusher.service';
import { Message, RequestNotice } from './dto/pusher.dto';
import { UseFilters, UseGuards } from '@nestjs/common';
import { WsUser } from '../user.decorator';
import { Socket } from 'socket.io';
import { JwtService } from '@app/jwt';
import { PusherError } from '@app/error';
import { WsAuthGuard } from '@app/shared/ws-auth.guard';
import { IsFriendGuard } from '@app/shared/is-friend.guard';
import { WsExceptionFilter } from '@app/shared/ws-exception-filter/ws-exception-filter.filter';
import {
  ExtendedMessage,
  RMQMessage,
  RMQRoute,
  RMQService,
  RMQValidate,
} from 'nestjs-rmq';

@WebSocketGateway(4000, {
  cors: {
    origin: '*',
  },
})
@UseFilters(new WsExceptionFilter())
export class PusherGateway implements OnGatewayConnection<Socket> {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly pusherService: PusherService,
    private readonly jwt: JwtService,
    private readonly rmqService: RMQService,
  ) {}

  @UseGuards(WsAuthGuard, IsFriendGuard)
  @SubscribeMessage('message')
  async sendMessage(
    @MessageBody() data: Message,
    @WsUser('tid') source: string,
  ) {
    const msg = await this.pusherService.persistence({ ...data, source });
    return {
      event: 'message',
      data: msg,
    };
  }

  @RMQValidate()
  @RMQRoute('notify:request', { manualAck: true })
  async notifyReuqest(
    data: RequestNotice,
    @RMQMessage message: ExtendedMessage,
  ) {
    this.server.to(`${data.target}`).emit('notify:request', data);
    this.rmqService.ack(message);
    return {};
  }

  handleConnection(client: Socket) {
    if (!client.handshake.headers.authorization) {
      client.emit('error', new PusherError(-1, 'INVALIDE_TOKEN'));
      client.disconnect(true);
      return;
    }
    const token = client.handshake.headers.authorization
      .replace('Bearer', '')
      .trim();
    try {
      const { tid }: { tid: string } = this.jwt.verify(token, {
        algorithms: ['RS256'],
      });
      client.join(tid);
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
