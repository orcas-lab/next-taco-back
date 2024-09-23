import request from 'supertest';
import { initTest } from './utils/init-test';
import { userLogin } from './utils/user-login';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Profile } from '@app/entity';
import { BanUser, UpdateUserProfileRequest } from '../src/user/dto/user.dto';

describe('User e2e', () => {
  let app: INestApplication<any>, db: DataSource;
  beforeAll(async () => {
    const handle = await initTest();
    app = handle.app;
    db = handle.db;
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
  });
  afterAll(async () => {
    await db.destroy();
    await app.close();
  });
  it('Get Self Profile', async () => {
    const { accessToken } = await userLogin(app, 'tester-a', 'testa');
    const { body }: { body: Profile } = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(body.update_at).toBeDefined();
    expect(body.create_at).toBeDefined();
    expect(body.friends_total).toBeDefined();
  });
  it('Get Other Profile (should not include create_at, update_at, friends_total)', async () => {
    const { accessToken } = await userLogin(app, 'tester-a', 'testa');
    const { body }: { body: Profile } = await request(app.getHttpServer())
      .get('/user/profile?tid=tester-b')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(body.update_at).toBeUndefined();
    expect(body.create_at).toBeUndefined();
    expect(body.friends_total).toBeUndefined();
  });
  it('Patch Self Profile', async () => {
    const { accessToken } = await userLogin(app, 'tester-a', 'testa');
    await request(app.getHttpServer())
      .patch('/user/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        description: 'desc',
      } as Partial<UpdateUserProfileRequest>);
    const { body }: { body: Profile } = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(body.description).toBe('desc');
  });
  it('Ban', async () => {
    const { accessToken } = await userLogin(app, 'tester-a', 'testa');
    const req = await request(app.getHttpServer())
      .post('/user/ban')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        target: 'tester-b',
      } as Partial<BanUser>);
    expect(req.statusCode).toBe(HttpStatus.CREATED);
  });
  it('Fail Ban (account not exists)', async () => {
    const { accessToken } = await userLogin(app, 'tester-a', 'testa');
    const req = await request(app.getHttpServer())
      .post('/user/ban')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        target: 'not exists',
      } as Partial<BanUser>);
    expect(req.statusCode).toBe(HttpStatus.NOT_FOUND);
  });
  it('Unban', async () => {
    const { accessToken } = await userLogin(app, 'tester-a', 'testa');
    const req = await request(app.getHttpServer())
      .del('/user/ban')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        target: 'tester-b',
      } as Partial<BanUser>);
    expect(req.statusCode).toBe(HttpStatus.OK);
  });
  it('Fail unban (account not exists)', async () => {
    const { accessToken } = await userLogin(app, 'tester-a', 'testa');
    const req = await request(app.getHttpServer())
      .del('/user/ban')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        target: 'not exists',
      } as Partial<BanUser>);
    expect(req.statusCode).toBe(HttpStatus.NOT_FOUND);
  });
});
