import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from '@app/shared/http-exception.filter';
import {
    DeleteAccountRequest,
    LoginRequest,
    RegisterReuqest,
} from 'src/account/dto/account.dto';
import { DataSource } from 'typeorm';
import { Profile } from '@app/entity/profile.entity';
import { BanUser } from 'src/user/dto/user.dto';
import { NestFactory } from '@nestjs/core';
import {
    Accept,
    AddFriend,
    DeleteFriend,
    UpdateFriend,
} from 'src/friends/dto/friend.rquest.dto';
import io, { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsExceptionFilter } from '@app/shared/ws-exception-filter/ws-exception-filter.filter';

let db: DataSource;
const drop = async () => {
    db = await new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'taco',
    }).initialize();
    await db.dropDatabase();
};
describe('AppController (e2e)', () => {
    let app: INestApplication;
    let token = '';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let profile: Profile;
    let ws: Socket<DefaultEventsMap, DefaultEventsMap>;
    beforeAll(async () => {
        await drop();
        app = await NestFactory.create(AppModule);
        app.useGlobalFilters(new WsExceptionFilter());
        app.useGlobalFilters(new HttpExceptionFilter());
        app.useWebSocketAdapter(new IoAdapter(app));
        await app.listen(3000);
    }, 60 * 1000);
    afterAll(async () => {
        await db.destroy();
        await app.close();
        ws.close();
    });
    describe('register', () => {
        const registerData: RegisterReuqest = {
            tid: 'tester',
            email: 'test@no-reply.com',
            password: 'test',
            question: {},
        };
        it('success', async () => {
            const { statusCode } = await request(app.getHttpServer())
                .post('/account/register')
                .send(registerData);
            expect(statusCode).toBe(HttpStatus.CREATED);
            await request(app.getHttpServer()).post('/account/register').send({
                tid: 'tester-2',
                email: 'test2@no-reply.com',
                password: 'test-2',
                question: {},
            });
            return Promise.resolve();
        });
        it('repeat', async () => {
            const { statusCode } = await request(app.getHttpServer())
                .post('/account/register')
                .send(registerData);
            expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
            return Promise.resolve();
        });
    });
    describe('login', () => {
        const loginData: LoginRequest = {
            tid: 'tester',
            password: 'test',
        };
        it(
            'success',
            async () => {
                const { statusCode, body } = await request(app.getHttpServer())
                    .post('/account/login')
                    .send(loginData);
                expect(statusCode).toBe(HttpStatus.CREATED);
                token = body.access_token;
                return Promise.resolve();
            },
            60 * 1000,
        );
        it('password error', () => {
            const loginData: LoginRequest = {
                tid: 'tester',
                password: 'wrong-password',
            };
            return request(app.getHttpServer())
                .post('/account/login')
                .send(loginData)
                .expect(HttpStatus.BAD_REQUEST);
        });
        it('tid not exists', () => {
            const loginData: LoginRequest = {
                tid: 'tester-1',
                password: 'test',
            };
            return request(app.getHttpServer())
                .post('/account/login')
                .send(loginData)
                .expect(HttpStatus.BAD_REQUEST);
        });
    });
    describe('change-password', () => {
        it('fail', () => {
            const updatePasswordData = {
                password: 'new-password',
                question: {},
            };
            request(app.getHttpServer())
                .patch('/account/change-password')
                .send(updatePasswordData)
                .expect(HttpStatus.UNAUTHORIZED);
            request(app.getHttpServer())
                .patch('/account/change-password')
                .send({
                    ...updatePasswordData,
                    question: {
                        a1: 'v1',
                    },
                })
                .set('authorization', `Bearer ${token}`)
                .expect(HttpStatus.BAD_REQUEST);
            const loginData: LoginRequest = {
                tid: 'tester',
                password: 'test',
            };
            return request(app.getHttpServer())
                .post('/account/login')
                .send(loginData)
                .expect(HttpStatus.CREATED);
        });
        it('success', async () => {
            const updatePasswordData = {
                password: 'new-password',
                question: {},
            };
            const loginData: LoginRequest = {
                tid: 'tester',
                password: 'test',
            };
            await request(app.getHttpServer())
                .patch('/account/change-password')
                .set('authorization', `Bearer ${token}`)
                .send(updatePasswordData);
            const { statusCode } = await request(app.getHttpServer())
                .post('/account/login')
                .send(loginData);
            expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
        });
    });
    describe('delete account', () => {
        it('fail', () => {
            const dto: DeleteAccountRequest = {
                question: {
                    k: 'v',
                },
            };
            request(app.getHttpServer())
                .del('/account')
                .send(dto)
                .set('authorization', `Bearer ${token}`)
                .expect(HttpStatus.BAD_REQUEST);
            request(app.getHttpServer())
                .del('/account')
                .send(dto)
                .expect(HttpStatus.UNAUTHORIZED);
            const loginData: LoginRequest = {
                tid: 'tester',
                password: 'new-password',
            };
            return request(app.getHttpServer())
                .post('/account/login')
                .send(loginData)
                .expect(HttpStatus.CREATED);
        });
        it('success', () => {
            const dto: DeleteAccountRequest = {
                question: {
                    k: 'v',
                },
            };
            request(app.getHttpServer())
                .del('/account')
                .send(dto)
                .set('authorization', `Bearer ${token}`)
                .expect(HttpStatus.OK);
            const loginData: LoginRequest = {
                tid: 'tester',
                password: 'test',
            };
            return request(app.getHttpServer())
                .post('/account/login')
                .send(loginData)
                .expect(HttpStatus.BAD_REQUEST);
        });
    });
    describe('user', () => {
        it('get profile', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/user/profile')
                .query({
                    tid: 'tester',
                })
                .send()
                .expect(HttpStatus.OK);
            profile = body;
            return Promise.resolve();
        });
        it('update profile', () => {
            const updateProfile = {
                profile: {
                    nick: 'tester-2',
                    description: 'description-1',
                },
            };
            return request(app.getHttpServer())
                .patch('/user/profile')
                .set('authorization', `Bearer ${token}`)
                .send(updateProfile)
                .expect(HttpStatus.NO_CONTENT);
        });
        it('ban user', async () => {
            const banUser: BanUser = {
                target: 'tester-2',
            };
            const { statusCode } = await request(app.getHttpServer())
                .post('/user/ban')
                .set('authorization', `Bearer ${token}`)
                .send(banUser);
            return expect(statusCode).toBe(HttpStatus.CREATED);
        });
        it('ban user but target not exists', async () => {
            const banUser: BanUser = {
                target: 'tester-3',
            };
            const { statusCode } = await request(app.getHttpServer())
                .post('/user/ban')
                .set('authorization', `Bearer ${token}`)
                .send(banUser);
            expect(statusCode).toBe(HttpStatus.FORBIDDEN);
        });
    });
    let rid = '';
    describe('friends', () => {
        it('add friends', async () => {
            let { statusCode, body } = await request(app.getHttpServer())
                .post('/friends')
                .set('authorization', `Bearer ${token}`)
                .send({
                    target: 'tester-2',
                } as AddFriend);
            rid = body.rid;
            body = (
                await request(app.getHttpServer())
                    .get('/requests')
                    .set('authorization', `Bearer ${token}`)
            ).body;
            expect(body).toStrictEqual([]);
            return expect(statusCode).toBe(HttpStatus.CREATED);
        });
        it('accept', async () => {
            const { statusCode } = await request(app.getHttpServer())
                .post('/friends/accept')
                .set('authorization', `Bearer ${token}`)
                .send({
                    rid,
                } as Accept);
            let { body } = await request(app.getHttpServer())
                .get('/friends')
                .query({
                    limit: 0,
                    offset: 0,
                })
                .set('authorization', `Bearer ${token}`);
            expect(body.friends).not.toStrictEqual([]);
            body = (
                await request(app.getHttpServer())
                    .get('/requests')
                    .set('authorization', `Bearer ${token}`)
            ).body;
            expect(body).toStrictEqual([]);
            return expect(statusCode).toBe(HttpStatus.CREATED);
        });
        it('update', async () => {
            const { statusCode } = await request(app.getHttpServer())
                .patch('/friends')
                .send({
                    target: 'tester-2',
                    nick: 'nick-2',
                } as UpdateFriend)
                .set('authorization', `Bearer ${token}`);
            await request(app.getHttpServer())
                .patch('/friends')
                .send({
                    target: 'tester-2',
                    tag: 'tag-2',
                } as UpdateFriend)
                .set('authorization', `Bearer ${token}`);
            expect(statusCode).toBe(HttpStatus.OK);
            const { body } = await request(app.getHttpServer())
                .get('/friends')
                .query({
                    limit: 0,
                    offset: 0,
                })
                .set('authorization', `Bearer ${token}`);
            expect(body.friends[0].nick).toBe('nick-2');
            return expect(body.friends[0].tag).toBe('tag-2');
        });
        it('find', async () => {
            let { body } = await request(app.getHttpServer())
                .get('/friends')
                .query({
                    limit: 0,
                    offset: 0,
                })
                .set('authorization', `Bearer ${token}`);
            expect(body.friends[0]).not.toStrictEqual([]);
            body = (
                await request(app.getHttpServer())
                    .get('/friends')
                    .query({
                        limit: 0,
                        offset: 1,
                    })
                    .set('authorization', `Bearer ${token}`)
            ).body;
            expect(body.friends).toStrictEqual([]);
        });
    });
    describe('pusher', () => {
        it(
            'not have token should be disconnect',
            async () => {
                ws = io('http://localhost:3000', {
                    autoConnect: false,
                });
                ws.connect();
                return new Promise<void>((resolve) => {
                    ws.on('disconnect', () => {
                        expect(ws.connected).toBeFalsy();
                        ws.close();
                        resolve();
                    });
                });
            },
            60 * 1000,
        );
        it('have token', async () => {
            ws = io('http://localhost:3000', {
                autoConnect: false,
                extraHeaders: {
                    authorization: `Bearer ${token}`,
                },
            });
            ws.connect();
            await new Promise<void>((resolve) => {
                ws.on('error', (err) => {
                    expect(err).toStrictEqual({
                        code: 4203,
                        msg: 'IS_NOT_FRIEND',
                    });
                });
                ws.on('connect', () => {
                    expect(ws.connected).toBeTruthy();
                    ws.close();
                    resolve();
                });
            });
        });
        it('ping', async () => {
            ws = io('http://localhost:3000', {
                autoConnect: false,
                extraHeaders: {
                    authorization: `Bearer ${token}`,
                },
            });
            await new Promise<void>((resolve) => {
                ws.connect();
                ws.on('pong', (msg) => {
                    expect(msg).toBe('pong');
                    ws.close();
                    resolve();
                });
                ws.emit('ping');
            });
        });
        it('friend chat', async () => {
            ws = io('http://localhost:3000', {
                autoConnect: false,
                extraHeaders: {
                    authorization: `Bearer ${token}`,
                },
            });
            ws.connect();
            await new Promise<void>((resolve) => {
                ws.on('message', (message) => {
                    expect(message).not.toBeUndefined();
                    ws.close();
                    resolve();
                });
                const msg = {
                    msg: 'hello',
                    target: 'tester-2',
                };
                ws.emit('message', msg);
            });
        });
        it('not friend', async () => {
            ws = io('http://localhost:3000', {
                autoConnect: false,
                extraHeaders: {
                    authorization: `Bearer ${token}`,
                },
            });
            ws.connect();
            await new Promise<void>((resolve) => {
                ws.on('error', (data) => {
                    expect(data).toBeDefined();
                    ws.close();
                    resolve();
                });
                const msg = {
                    msg: 'hello',
                    target: 'tester-100',
                };
                ws.emit('message', msg);
            });
        });
    });
    describe('friend', () => {
        it('delete', async () => {
            let { body } = await request(app.getHttpServer())
                .get('/friends')
                .query({
                    limit: 0,
                    offset: 0,
                })
                .set('authorization', `Bearer ${token}`);
            expect(body.friends).not.toStrictEqual([]);
            await request(app.getHttpServer())
                .delete('/friends')
                .set('authorization', `Bearer ${token}`)
                .send({
                    target: 'tester-2',
                    type: 'both',
                    ban: true,
                } as DeleteFriend);
            body = (
                await request(app.getHttpServer())
                    .get('/friends')
                    .query({
                        limit: 0,
                        offset: 0,
                    })
                    .set('authorization', `Bearer ${token}`)
            ).body;
            return expect(body.friends).toStrictEqual([]);
        });
        it('add friends', async () => {
            const { statusCode, body } = await request(app.getHttpServer())
                .post('/friends')
                .set('authorization', `Bearer ${token}`)
                .send({
                    target: 'tester-2',
                } as AddFriend);
            rid = body.rid;
            return expect(statusCode).toBe(HttpStatus.CREATED);
        });
        it('reject', async () => {
            const { statusCode } = await request(app.getHttpServer())
                .post('/friends/reject')
                .query({ rid })
                .set('authorization', `Bearer ${token}`);
            const { body } = await request(app.getHttpServer())
                .get('/friends')
                .query({
                    limit: 0,
                    offset: 0,
                })
                .set('authorization', `Bearer ${token}`);
            expect(body.friends).toStrictEqual([]);
            return expect(statusCode).toBe(HttpStatus.CREATED);
        });
    });
});
