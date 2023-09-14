import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { DbModule } from '@app/db';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '@app/schema/account.schema';
import { Friends, FriendsSchema } from '@app/schema/friends.schema';
import { BlackList, BlackListSchema } from '@app/schema/black-list.schema';
import { ConfigModule } from '@app/config';

@Module({
    imports: [
        DbModule,
        MongooseModule.forFeature([
            {
                name: Account.name,
                collection: Account.name.toLowerCase(),
                schema: AccountSchema,
            },
            {
                name: Friends.name,
                collection: Friends.name.toLowerCase(),
                schema: FriendsSchema,
            },
            {
                name: BlackList.name,
                collection: BlackList.name.toLowerCase(),
                schema: BlackListSchema,
            },
        ]),
        ConfigModule.forRoot('config.toml'),
    ],
    controllers: [FriendsController],
    providers: [FriendsService],
})
export class FriendsModule {}
