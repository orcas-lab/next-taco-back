import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { clearDatabase, initTest } from './utils/init-test';
import { userLogin } from './utils/user-login';
import { useToken } from './utils/useToken';
import {
    Accept,
    AddFriend,
    AddFriendResponse,
    DeleteFriend,
    Reject,
    UpdateFriend,
} from '../src/friends/dto/friend.rquest.dto';

describe('Friend', () => {
    let app: INestApplication<any>, db: DataSource;
    const rids: Record<string, [string, string][]> = {};
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
        await clearDatabase(app);
    });
    afterAll(async () => {
        await db.dropDatabase();
        await db.destroy();
        await app.close();
    });
    describe('Friend', () => {
        it('Send Add Request', async () => {
            const data: AddFriend = {
                target: 'tester-b',
            };
            const { accessToken } = await userLogin(app, 'tester-a', 'testa');
            const { body }: { body: AddFriendResponse } = await useToken(
                request(app.getHttpServer()).post('/friends').send(data),
                accessToken,
            );
            rids['tester-b'] = [['tester-a', body.rid]];
            expect(body.rid).toBeDefined();
        });
        it('Accept add request', async () => {
            const data: AddFriend = {
                target: 'tester-b',
            };
            const { accessToken } = await userLogin(app, 'tester-a', 'testa');
            const {
                body: { rid },
            }: { body: AddFriendResponse } = await useToken(
                request(app.getHttpServer()).post('/friends').send(data),
                accessToken,
            );
            const { accessToken: bToken } = await userLogin(
                app,
                'tester-b',
                'testb',
            );
            const { statusCode } = await useToken(
                request(app.getHttpServer())
                    .post('/friends/accept')
                    .send({
                        rid: rid,
                    } as Accept),
                bToken,
            );
            expect(statusCode).toBe(HttpStatus.CREATED);
            const { statusCode: notFoundStatusCode } = await useToken(
                request(app.getHttpServer())
                    .post('/friends/accept')
                    .send({
                        rid: rid,
                    } as Accept),
                accessToken,
            );
            expect(notFoundStatusCode).toBe(HttpStatus.NOT_FOUND);
        });
        it('Delete Friend', async () => {
            const data: AddFriend = {
                target: 'tester-b',
            };
            const { accessToken } = await userLogin(app, 'tester-a', 'testa');
            const {
                body: { rid },
            }: { body: AddFriendResponse } = await useToken(
                request(app.getHttpServer()).post('/friends').send(data),
                accessToken,
            );
            const { accessToken: bToken } = await userLogin(
                app,
                'tester-b',
                'testb',
            );
            await useToken(
                request(app.getHttpServer())
                    .post('/friends/accept')
                    .send({
                        rid: rid,
                    } as Accept),
                bToken,
            );
            await useToken(
                request(app.getHttpServer())
                    .del('/friends')
                    .send({
                        target: 'tester-b',
                        ban: true,
                        type: 'both',
                    } as DeleteFriend),
                accessToken,
            );
            const { body } = await useToken(
                request(app.getHttpServer()).get('/friends'),
                accessToken,
            );
            expect(body.friends.length).toBe(0);
        });
        it('Reject add request', async () => {
            const data: AddFriend = {
                target: 'tester-b',
            };
            const { accessToken } = await userLogin(app, 'tester-a', 'testa');
            const {
                body: { rid },
            }: { body: AddFriendResponse } = await useToken(
                request(app.getHttpServer()).post('/friends').send(data),
                accessToken,
            );
            const { accessToken: bToken } = await userLogin(
                app,
                'tester-b',
                'testb',
            );
            await useToken(
                request(app.getHttpServer())
                    .post('/friends/reject')
                    .send({
                        rid: rid,
                    } as Reject),
                bToken,
            );
            const { body } = await useToken(
                request(app.getHttpServer()).get('/friends'),
                accessToken,
            );
            expect(body.friends.length).toBe(0);
        });
        it('Patch friend information (nick, tag, but profile should not be update)', async () => {
            const data: AddFriend = {
                target: 'tester-b',
            };
            const { accessToken } = await userLogin(app, 'tester-a', 'testa');
            const {
                body: { rid },
            }: { body: AddFriendResponse } = await useToken(
                request(app.getHttpServer()).post('/friends').send(data),
                accessToken,
            );
            const { accessToken: bToken } = await userLogin(
                app,
                'tester-b',
                'testb',
            );
            await useToken(
                request(app.getHttpServer())
                    .post('/friends/accept')
                    .send({
                        rid: rid,
                    } as Reject),
                bToken,
            );
            await useToken(
                request(app.getHttpServer())
                    .patch('/friends')
                    .send({
                        target: 'tester-b',
                        nick: 'friend-test-b',
                    } as Partial<UpdateFriend>),
                accessToken,
            );
            const { body } = await useToken(
                request(app.getHttpServer()).get('/friends'),
                accessToken,
            );
            const friend = body.friends.filter(
                (f) => f.nick === 'friend-test-b',
            );
            expect(friend).toBeDefined();
        });
    });
});
