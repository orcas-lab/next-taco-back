import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { UserModule } from './user/user.module';
import { FriendsModule } from './friends/friends.module';
import { ReputationModule } from './reputation/reputation.module';
import { RequestModule } from './request/request.module';
import { NoticeModule } from './notice/notice.module';

@Module({
    imports: [
        AccountModule,
        UserModule,
        FriendsModule,
        ReputationModule,
        RequestModule,
        NoticeModule,
    ],
})
export class GatewayModule {}
