import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { UserModule } from './user/user.module';
import { FriendsModule } from './friends/friends.module';

@Module({
    imports: [AccountModule, UserModule, FriendsModule],
})
export class GatewayModule {}
