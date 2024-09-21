import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Account } from '@app/entity';

export const createUser = async (
    app: INestApplication,
    {
        tid,
        email,
        password,
        question,
    }: {
        tid: string;
        email: string;
        password: string;
        question: Record<string, any>;
    },
) => {
    const httpServer = app.getHttpServer();
    const data = await request(httpServer)
        .post('/account/register')
        .send({ tid, email, password, question });
    return data.body as Account;
};
