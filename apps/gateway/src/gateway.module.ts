import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { UserModule } from './user/user.module';
import { FriendsModule } from './friends/friends.module';
import { ReputationModule } from './reputation/reputation.module';

@Module({
    imports: [AccountModule, UserModule, FriendsModule, ReputationModule],
})
export class GatewayModule {}
