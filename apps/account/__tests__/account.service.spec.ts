import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../src/account.service';
import { DbModule } from '@app/db';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '@app/schema/account.schema';
import { ConfigModule } from '@app/config';
import providers from '@app/clients-provider';
import { getRedisToken } from '@liaoliaots/nestjs-redis';

describe('AccountController', () => {
    let accountService: AccountService;
    let exists = 1;
    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
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
            providers: [
                AccountService,
                {
                    provide: providers['TOKEN_SERVICE']['name'],
                    useValue: {
                        getService: () => ({
                            sign: jest.fn().mockResolvedValue({
                                access_token: '',
                                refresh_token: '',
                            }),
                        }),
                    },
                },
                {
                    provide: getRedisToken('default'),
                    useValue: {
                        exists: () => exists,
                        del: () => {
                            exists = 0;
                            return true;
                        },
                    },
                },
            ],
        }).compile();

        accountService = app.get<AccountService>(AccountService);
    });
    it('should be defined', () => {
        expect(accountService).toBeDefined();
    });
    it('addUser', async () => {
        expect(
            accountService.register({
                tid: 'test',
                nick: 'test',
                birthday: '1234-2-7',
                password: '123456789',
                email: 'test@no-reply.com',
                sex: 'other',
                question: { k1: 'v1', k2: 'v2' },
            }),
        ).resolves.not.toThrow();
        expect(
            accountService.register({
                tid: 'test-2',
                nick: 'test',
                birthday: '1234-2-7',
                password: '123456789',
                email: 'test@no-reply.com',
                sex: 'other',
                question: {},
            }),
        ).resolves.not.toThrow();
        return expect(
            accountService.register({
                tid: 'test',
                nick: 'test',
                birthday: '1234-2-7',
                password: '123456789',
                email: 'test@no-reply.com',
                sex: 'other',
                question: {},
            }),
        ).rejects.toThrow();
    });
    it('account_exists', () => {
        expect(
            accountService.accountExists({
                tid: 'test',
                password: '123456789',
            }),
        ).resolves.toBeTruthy();
        return expect(
            accountService.accountExists({
                tid: 'sadisaod',
                password: '123456789',
            }),
        ).resolves.toBeFalsy();
    });
    it('change password', async () => {
        expect(
            accountService.changePassword({
                tid: 'test',
                new_pass: '123456789Sd!',
                question: { k1: 'v1', k2: 'v2' },
            }),
        ).resolves.toBeTruthy();
        expect(
            accountService.changePassword({
                tid: 'test',
                new_pass: '123456789Sd!',
                question: { k2: 'v2', k1: 'v1' },
            }),
        ).resolves.toBeTruthy();
        expect(
            accountService.changePassword({
                tid: 'test',
                new_pass: '123456789Sd!',
                question: { k2: 'v3', k1: 'v1' },
            }),
        ).resolves.toBeFalsy();
        return expect(
            accountService.accountExists({
                tid: 'test',
                password: '123456789',
            }),
        ).resolves.toBeFalsy();
    });
    it('delete account', () => {
        return expect(accountService.deleteAccount({ tid: 'test' }))
            .resolves.toBeDefined()
            .then(() => {
                return expect(
                    accountService.accountExists({
                        tid: 'test',
                        password: '123456789',
                    }),
                ).resolves.toBeFalsy();
            });
    });
    it('online', () => {
        return expect(
            accountService.online({ tid: 'test' }),
        ).resolves.toBeTruthy();
    });
    it('kick', () => {
        expect(accountService.kick({ tid: 'test' })).resolves.toBeTruthy();
        return expect(
            accountService.online({ tid: 'test' }),
        ).resolves.toBeFalsy();
    });
});
