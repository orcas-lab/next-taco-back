import { Test, TestingModule } from '@nestjs/testing';
import { BlackListService } from '../src/black-list.service';
import { ConfigModule } from '@app/config';
import { BlackList, BlackListSchema } from '@app/schema/black-list.schema';
import { Account, AccountSchema } from '@app/schema/account.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModule } from '@app/db';
import {
    Client,
    ClientGrpc,
    ClientsModule,
    Transport,
} from '@nestjs/microservices';
import { createMock } from '@golevelup/nestjs-testing';
import { AccountService } from '../../account/src/account.service';

describe('BlackListService', () => {
    let service: BlackListService;
    const accountExists = true;
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                BlackListService,
                {
                    provide: 'ACCOUNT_SERVICE',
                    useValue: {},
                },
            ],
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
        }).compile();

        service = app.get<BlackListService>(BlackListService);
    });

    it('should not be undefined', () => {
        expect(service).not.toBeUndefined();
    });
    describe.skip('add', () => {
        it('success', () => {
            const mock = createMock<AccountService>();
            mock.accountExists.mockResolvedValue(true);
            return expect(
                service.add({ source: 'test', target: 'test-2' }),
            ).resolves.not.toThrow();
        });
    });
});
