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
    beforeAll(async () => {
        await drop();
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        // app.useLogger(true);
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
        it('success', () => {
            request(app.getHttpServer())
                .post('/account/register')
                .send(registerData)
                .expect(HttpStatus.CREATED);
        });
        it('repeat', () => {
            request(app.getHttpServer())
                .post('/account/register')
                .send(registerData)
                .expect(HttpStatus.BAD_REQUEST);
        });
    });
    describe('login', () => {
        it('success', () => {
            const loginData: LoginRequest = {
                tid: 'tester',
                password: 'test',
            };
            request(app.getHttpServer())
                .post('/account/login')
                .send(loginData)
                .expect(HttpStatus.CREATED);
        });
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
