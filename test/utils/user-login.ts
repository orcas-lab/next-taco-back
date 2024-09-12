import { INestApplication } from '@nestjs/common';
import request from 'supertest';
const tokens: Record<string, { accessToken: string; refreshToken: string }> =
    {};
export const userLogin = async (
    app: INestApplication,
    tid: string,
    password: string,
) => {
    const { body } = await request(app.getHttpServer())
        .post('/account/login')
        .send({ tid, password });
    const { access_token, refresh_token } = body;
    tokens[tid] = {
        accessToken: access_token,
        refreshToken: refresh_token,
    };
    return tokens[tid];
};
