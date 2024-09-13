import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { initTest } from './utils/init-test';
import request from 'supertest';
import { getTokens, userLogin } from './utils/user-login';
import { io, Socket } from 'socket.io-client';
import { Message } from '../src/pusher/dto/pusher.dto';
import { useToken } from './utils/useToken';

describe('Pusher e2e', () => {
    let app: INestApplication<any>, db: DataSource;
    const sockets: Socket<any, any>[] = [];
    beforeAll(async () => {
        const handle = await initTest();
        app = handle.app;
        db = handle.db;
    }, 60 * 1000);
    beforeEach(async () => {
        await request(app.getHttpServer())
            .post('/account/register')
            .send({
                tid: 'tester-a',
                email: 'testa@no-reply.com',
                password: 'testa',
                question: {
                    q1: 'a1',
                },
            });
        await request(app.getHttpServer())
            .post('/account/register')
            .send({
                tid: 'tester-b',
                email: 'testb@no-reply.com',
                password: 'testb',
                question: {
                    q1: 'a1',
                },
            });
        await request(app.getHttpServer())
            .post('/account/register')
            .send({
                tid: 'tester-c',
                email: 'testc@no-reply.com',
                password: 'testc',
                question: {
                    q1: 'a1',
                },
            });
        await userLogin(app, 'tester-a', 'testa');
        await userLogin(app, 'tester-b', 'testb');
        await userLogin(app, 'tester-c', 'testc');
    }, 60 * 1000);
    afterEach(async () => {
        if (db.isInitialized) {
            await db.destroy();
        }
        await db.initialize();
        while (sockets.length) {
            sockets.shift().disconnect();
        }
    });
    afterAll(async () => {
        await db.dropDatabase();
        await app.close();
    });
    it('FAIL tester-a send "hello-world" to testb (not a friend)', (done) => {
        const a = io('http://localhost:4000', {
            extraHeaders: {
                authorization: getTokens('tester-a', 'accessToken'),
            },
        });
        const b = io('http://localhost:4000', {
            extraHeaders: {
                authorization: getTokens('tester-b', 'accessToken'),
            },
        });
        sockets.push(a);
        sockets.push(b);
        a.connect();
        b.connect();
        const errorCallback = jest.fn();
        a.on('error', errorCallback);
        a.emit('message', {
            target: 'tester-b',
            msg: 'hello-world',
        } as Message);
        setTimeout(() => {
            expect(errorCallback).toHaveBeenCalled();
            done();
        }, 3000);
    });
    it('tester-a send "hello-world" to testb', async () => {
        const data = {
            target: 'tester-b',
        };
        const { accessToken } = await userLogin(app, 'tester-a', 'testa');
        const {
            body: { rid },
        }: { body } = await useToken(
            request(app.getHttpServer()).post('/friends').send(data),
            accessToken,
        );
        const { accessToken: bToken } = await userLogin(
            app,
            'tester-b',
            'testb',
        );
        await useToken(
            request(app.getHttpServer()).post('/friends/accept').send({
                rid: rid,
            }),
            bToken,
        );
        const a = io('http://localhost:4000', {
            extraHeaders: {
                authorization: getTokens('tester-a', 'accessToken'),
            },
        });
        const b = io('http://localhost:4000', {
            extraHeaders: {
                authorization: `Bearer ${bToken}`,
            },
        });
        sockets.push(a);
        sockets.push(b);
        a.connect();
        b.connect();
        const errorCallback = jest.fn();
        const msgCallback = jest.fn();
        a.on('error', errorCallback);
        b.on('msg', msgCallback);
        a.emit('message', {
            target: 'tester-b',
            msg: 'hello-world',
        } as Message);
        return new Promise((resolve) => {
            setTimeout(() => {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(msgCallback).toHaveBeenCalled();
                resolve(true);
            }, 2000);
        });
    });
    it('tester-a send "add friend" request to tester-c, should trigger tester-c "notify:request" event', async () => {
        const a = io('http://localhost:4000', {
            extraHeaders: {
                authorization: getTokens('tester-a', 'accessToken'),
            },
        });
        const b = io('http://localhost:4000', {
            extraHeaders: {
                authorization: getTokens('tester-c', 'accessToken'),
            },
        });
        sockets.push(a, b);
        const notifyCallBackMock = jest.fn();
        b.on('notify:request', notifyCallBackMock);
        await useToken(
            request(app.getHttpServer()).post('/friends').send({
                target: 'tester-c',
            }),
            getTokens('tester-a', 'accessToken').replace('Bearer ', ''),
        );
        return new Promise((resolve) => {
            setTimeout(() => {
                expect(notifyCallBackMock).toHaveBeenCalled();
                resolve(true);
            }, 3000);
        });
    });
});
