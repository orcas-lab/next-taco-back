import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';
import { Socket } from 'socket.io';
import { Handshake } from 'socket.io/dist/socket';

export const WsUser = createParamDecorator(
    async (data: keyof User, ctx: ExecutionContext) => {
        const context = ctx.switchToWs();
        const req = (context as WsArgumentsHost).getClient<Socket>()
            .handshake as Handshake & { user: User };
        const user = req.user;
        return user[data];
    },
);

export const User = createParamDecorator(
    async (data: keyof (User & { ws: boolean }), ctx: ExecutionContext) => {
        const context = data === 'ws' ? ctx.switchToWs() : ctx.switchToHttp();
        let req: (Handshake | Request) & { user: User };
        if (data === 'ws') {
            req = (context as WsArgumentsHost).getClient<Socket>()
                .handshake as Handshake & { user: User };
        } else {
            req = (context as HttpArgumentsHost).getRequest<
                Request & { user: User }
            >();
        }
        const user = req.user;
        return user[data];
    },
);
