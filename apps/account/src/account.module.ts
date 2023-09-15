import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { DbModule } from '@app/db';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '@app/schema/account.schema';
import { ConfigModule } from '@app/config';
import { ClientsModule } from '@nestjs/microservices';
import providers from '@app/clients-provider';

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
        ClientsModule.register({
            clients: [providers.TOKEN_SERVICE],
        }),
    ],
    controllers: [AccountController],
    providers: [AccountService],
})
export class AccountModule {}
