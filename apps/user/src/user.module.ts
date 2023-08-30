import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DbModule } from '@app/db';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '@app/schema/account.schema';
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
        ]),
        ConfigModule.forRoot('config.toml'),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
