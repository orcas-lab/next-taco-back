import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from '@app/shared/http-exception.filter';
import { LoginRequest, RegisterReuqest } from 'src/account/dto/account.dto';
import { DataSource } from 'typeorm';
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
    beforeAll(async () => {
        await drop();
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();
    }, 60 * 1000);
    afterAll(async () => {
        await db.destroy();
        await app.close();
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
            request(app.getHttpServer())
                .post('/account/login')
                .send(loginData)
                .expect(HttpStatus.BAD_REQUEST);
        });
        it('tid not exists', () => {
            const loginData: LoginRequest = {
                tid: 'tester-1',
                password: 'test',
            };
            request(app.getHttpServer())
                .post('/account/login')
                .send(loginData)
                .expect(HttpStatus.BAD_REQUEST);
        });
    });
});
