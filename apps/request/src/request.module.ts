import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { ClientsModule } from '@nestjs/microservices';
import providers from '@app/clients-provider';
import { KeypairModule } from '@app/keypair';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModule } from '@app/db';
import { Account, AccountSchema } from '@app/schema/account.schema';
import { RequestSchema, Requests } from '@app/schema/requests.schema';
import { CmdProcessModule } from '@app/cmd-process';

@Module({
    imports: [
        ClientsModule.register({
            clients: [providers['FRIEND_SERVICE'], providers.NOTICE_SERVICE],
        }),
        KeypairModule.forRoot(),
        DbModule,
        MongooseModule.forFeature([
            {
                name: Account.name,
                collection: Account.name.toLowerCase(),
                schema: AccountSchema,
            },
            {
                name: Requests.name,
                collection: Requests.name.toLowerCase(),
                schema: RequestSchema,
            },
        ]),
        CmdProcessModule,
    ],
    controllers: [RequestController],
    providers: [RequestService],
})
export class RequestModule {}
