import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from '../src/request.service';
import { KeypairModule } from '@app/keypair';
import { DbModule } from '@app/db';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestSchema, Requests } from '@app/schema/requests.schema';
import { CmdProcessModule } from '@app/cmd-process';
import providers from '@app/clients-provider';
import mongoose from 'mongoose';
import { Account, AccountSchema } from '@app/schema/account.schema';

describe('RequestService', () => {
    let service: RequestService;
    const rids: string[] = [];
    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
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
            providers: [
                RequestService,
                {
                    provide: providers.FRIEND_SERVICE.name,
                    useValue: {
                        getService: () => ({
                            accept: jest.fn(),
                        }),
                    },
                },
                {
                    provide: providers.NOTICE_SERVICE.name,
                    useValue: {
                        getService: () => ({
                            createNotice: jest.fn(),
                        }),
                    },
                },
            ],
        })
            .overrideProvider(providers.NOTICE_SERVICE.name)
            .useValue({
                getService: () => ({
                    createNotice: jest.fn(),
                }),
            })
            .overrideProvider(providers.FRIEND_SERVICE.name)
            .useValue({
                getService: () => ({
                    accept: jest.fn(),
                }),
            })
            .compile();
        const createFakeUser = (tid: string) => {
            return {
                nick: `${tid}`,
                tid: `${tid}`,
                password: '',
                sex: '',
                email: '',
                description: '',
                friend_total: 1,
            };
        };
        const instance = mongoose.connections[1];
        const accountModel = instance.models[Account.name];
        for (let i = 1; i <= 100; i++) {
            await accountModel.insertMany([
                createFakeUser(`test-${i.toString()}`),
            ]);
        }
        service = app.get<RequestService>(RequestService);
    }, 60 * 1000);
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('add request', async () => {
        expect(
            await service.add({
                sender: 'test-1',
                reciver: 'test-2',
                cmd: 'FRIEND.TEST.SENDER',
                meta: {},
            }),
        );
        return expect(
            await service.add({
                sender: 'test-1',
                reciver: 'test-2',
                cmd: 'FRIEND.ACCEPT.SENDER',
                meta: {},
            }),
        ).toBeTruthy();
    });
    it('list requests', async () => {
        rids.push(
            (await service.listReuqests({ tid: 'test-1', page: 1 }))[0].rid,
            (await service.listReuqests({ tid: 'test-1', page: 1 }))[1].rid,
        );
        return expect(
            await service.listReuqests({ tid: 'test-1', page: 1 }),
        ).not.toStrictEqual([]);
    });
    it('refuse', async () => {
        return expect(service.refuse({ rid: rids[0] })).resolves.toBeTruthy();
    });
    it('accept', async () => {
        return expect(service.accept({ rid: rids[1] })).resolves.toBeTruthy();
    });
});
