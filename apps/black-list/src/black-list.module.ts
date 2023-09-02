import { Module } from '@nestjs/common';
import { BlackListController } from './black-list.controller';
import { BlackListService } from './black-list.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Account, AccountSchema } from '@app/schema/account.schema';
import { DbModule } from '@app/db';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@app/config';
import { BlackList, BlackListSchema } from '@app/schema/black-list.schema';

@Module({
    imports: [
        ClientsModule.register({
            clients: [
                {
                    name: 'ACCOUNT_SERVICE',
                    transport: Transport.GRPC,
                    options: {
                        package: 'account',
                        protoPath: './proto/account.proto',
                        url: 'localhost:50000',
                    },
                },
            ],
        }),
        DbModule,
        MongooseModule.forFeature([
            {
                name: Account.name,
                collection: Account.name.toLowerCase(),
                schema: AccountSchema,
            },
            {
                name: BlackList.name,
                collection: BlackList.name.toLowerCase(),
                schema: BlackListSchema,
            },
        ]),
        ConfigModule.forRoot('config.toml'),
    ],
    controllers: [BlackListController],
    providers: [BlackListService],
})
export class BlackListModule {}
