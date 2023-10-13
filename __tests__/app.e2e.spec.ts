import { HttpStatus, INestApplication, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GatewayModule } from '../apps/gateway/src/gateway.module';
import * as request from 'supertest';
import { Register } from '@app/dto';
import { HttpExceptionFilter } from '@app/common/http-exception.filter';

describe('gateway', () => {
    @Module({
        imports: [GatewayModule],
    })
    class M {}
    let app: INestApplication;
    let server: any;
    beforeAll(async () => {
        app = await NestFactory.create(M);
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.listen(65535);
        server = app.getHttpServer();
    });
    it('', () => {
        expect(true).toBeTruthy();
        expect(server).toBeDefined();
    });
    it(
        'register and login',
        async () => {
            const dto: Register = {
                tid: 'test-1',
                nick: 'tester',
                password: 'test',
                email: 'test@no-reply.com',
                sex: 'other',
                question: {
                    q1: 'a1',
                },
                birthday: '1990-01-01',
            };
            expect(
                (await request(server).post('/account/register').send(dto))
                    .statusCode,
            ).toBe(HttpStatus.CREATED);
            expect(
                (await request(server).post('/account/register').send(dto))
                    .statusCode,
            ).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(
                (
                    await request(server).post('/account/login').send({
                        tid: 'test-1',
                    })
                ).statusCode,
            ).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(
                (
                    await request(server).post('/account/login').send({
                        tid: 'test-1',
                        password: 'test',
                    })
                ).statusCode,
            ).toBe(HttpStatus.CREATED);
            return expect(
                (
                    await request(server)
                        .post('/account/login')
                        .send({ tid: 'test-1', password: 'test-1' })
                ).statusCode,
            ).toBe(HttpStatus.BAD_REQUEST);
        },
        60 * 1000,
    );
});
