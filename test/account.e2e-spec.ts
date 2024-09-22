import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '@app/shared/http-exception.filter';
import { DataSource } from 'typeorm';
import { Profile } from '@app/entity/profile.entity';
import { NestFactory } from '@nestjs/core';
import { Socket } from 'socket.io-client';
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
describe('Account e2e', () => {
  let app: INestApplication;
  const tokens: Record<string, { accessToken: string; refreshToken: string }> =
    {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let profile: Profile;
  let ws: Socket<DefaultEventsMap, DefaultEventsMap>;
  beforeAll(async () => {
    await drop();
    app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new WsExceptionFilter());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useWebSocketAdapter(new IoAdapter(app));
    await app.listen(3000);
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
  }, 60 * 1000);
  afterAll(async () => {
    await db.destroy();
    await app.close();
    if (ws) {
      ws.close();
    }
  });
  describe('Account', () => {
    it('Register', async () => {
      const req = await request(app.getHttpServer())
        .post('/account/register')
        .send({
          tid: 'tester-d',
          email: 'testd@no-reply.com',
          password: 'testd',
          question: {
            q1: 'a1',
          },
        });
      expect(req.statusCode).toBe(HttpStatus.CREATED);
    });
    it('Fail Register Fail(duplicate)', async () => {
      const req = await request(app.getHttpServer())
        .post('/account/register')
        .send({
          tid: 'tester-a',
          email: 'testc@no-reply.com',
          password: 'testc',
          question: {
            q1: 'a1',
          },
        });
      expect(req.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
    it('Login', async () => {
      const req = await request(app.getHttpServer())
        .post('/account/login')
        .send({
          tid: 'tester-a',
          password: 'testa',
        });
      const { access_token, refresh_token } = req.body;
      expect(access_token).toBeDefined();
      expect(refresh_token).toBeDefined();
      tokens['tester-a'] = {
        accessToken: access_token,
        refreshToken: refresh_token,
      };
      expect(req.statusCode).toBe(HttpStatus.CREATED);
    });
    it('Fail Login (tid or password error)', async () => {
      const req = await request(app.getHttpServer())
        .post('/account/login')
        .send({
          tid: 'tester-a',
          password: '123456',
        });
      expect(req.statusCode).not.toBe(HttpStatus.CREATED);
      expect(req.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
    it('Delete Self', async () => {
      //
      while (!tokens['tester-a']) {}
      const req = await request(app.getHttpServer())
        .delete('/account')
        .set('Authorization', `Bearer ${tokens['tester-a'].accessToken}`)
        .set('Content-Type', 'application/json')
        .send({
          question: {
            q1: 'a1',
          },
        });
      expect(req.statusCode).toBe(HttpStatus.OK);
      const req2 = await request(app.getHttpServer())
        .delete('/account')
        .set('Authorization', `Bearer ${tokens['tester-a'].accessToken}`)
        .set('Content-Type', 'application/json')
        .send({
          question: {
            q1: 'a1',
          },
        });
      expect(req2.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(req2.body.message).toBe('ACCOUNT_NOT_EXISTS');
    });
    it('Fail Delete (Question Error)', async () => {
      const l = await request(app.getHttpServer())
        .post('/account/login')
        .send({ tid: 'tester-b', password: 'testb' });
      const { access_token, refresh_token } = l.body;
      tokens['tester-b'] = {
        accessToken: access_token,
        refreshToken: refresh_token,
      };
      const req = await request(app.getHttpServer())
        .delete('/account')
        .set('Authorization', `Bearer ${tokens['tester-b'].accessToken}`)
        .set('Content-Type', 'application/json')
        .send({
          question: {
            q1: 'a2',
          },
        });
      expect(req.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(req.body.message).toBe('QUESTION_INVALIDE');
    });
    it('Change Password', async () => {
      const req = await request(app.getHttpServer())
        .patch('/account/change-password')
        .set('Authorization', `Bearer ${tokens['tester-b'].accessToken}`)
        .send({
          password: 'new-pwd',
          question: {
            q1: 'a1',
          },
        });
      expect(req.statusCode).toBe(HttpStatus.OK);
    });
    it('Fail Change Password (question error)', async () => {
      const l = await request(app.getHttpServer())
        .post('/account/login')
        .send({ tid: 'tester-b', password: 'new-pwd' });
      const { access_token, refresh_token } = l.body;
      tokens['tester-b'] = {
        accessToken: access_token,
        refreshToken: refresh_token,
      };
      const req = await request(app.getHttpServer())
        .delete('/account')
        .set('Authorization', `Bearer ${access_token}`)
        .set('Content-Type', 'application/json')
        .send({
          question: {
            q1: 'a2',
          },
        });
      expect(req.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(req.body.message).toBe('QUESTION_INVALIDE');
    });
  });
});
