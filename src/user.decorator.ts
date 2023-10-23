import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
    async (data: keyof User, ctx: ExecutionContext) => {
        const http = ctx.switchToHttp();
        const req = http.getRequest<Request & { user: User }>();
        const user = req.user;
        return user[data];
    },
);
