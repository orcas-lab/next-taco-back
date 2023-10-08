import { INestApplication, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AccountModule } from '../apps/account/src/account.module';
import { BlackListModule } from '../apps/black-list/src/black-list.module';
import { FriendsModule } from '../apps/friends/src/friends.module';
import { GatewayModule } from '../apps/gateway/src/gateway.module';
import { NoticeModule } from '../apps/notice/src/notice.module';
import { ReputationModule } from '../apps/reputation/src/reputation.module';
import { RequestModule } from '../apps/request/src/request.module';
import { TokenModule } from '../apps/token/src/token.module';
import { UserModule } from '../apps/user/src/user.module';

describe('gateway', () => {
    @Module({
        imports: [
            GatewayModule,
            AccountModule,
            BlackListModule,
            FriendsModule,
            NoticeModule,
            ReputationModule,
            RequestModule,
            TokenModule,
            UserModule,
        ],
    })
    class M {}
    let app: INestApplication;
    let server: any;
    beforeAll(async () => {
        app = await NestFactory.create(M);
        app.listen(4000);
        server = app.getHttpServer();
    });
    it('', () => {
        expect(true).toBeTruthy();
        expect(server).toBeDefined();
    });
});
