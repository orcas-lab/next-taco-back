import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { Account, AccountSchema } from '@app/schema/account.schema';
import { BlackList, BlackListSchema } from '@app/schema/black-list.schema';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { BlackListService } from '../src/black-list.service';
describe('BlackListService', () => {
    let service: BlackListService;
    let exists = true;
    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                ClientsModule,
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
            providers: [
                BlackListService,
                {
                    provide: 'ACCOUNT_SERVICE',
                    useValue: {
                        getService: () => ({
                            accountExists: () => exists,
                        }),
                    },
                },
            ],
        })
            .overrideProvider('ACCOUNT_SERVICE')
            .useValue({
                getService: () => ({
                    accountExists: () => exists,
                }),
            })
            .compile();
        service = app.get<BlackListService>(BlackListService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('hasTarget', () => {
        return expect(service._hasTarget('test', 'test2')).resolves.toBeFalsy();
    });
    it('get', () => {
        return expect(
            service.query({ source: 'test', page: 1 }),
        ).resolves.not.toThrow();
    });
    describe('add', () => {
        it('success', () => {
            return expect(
                service.add({ target: 'test-2', source: 'test' }),
            ).resolves.toBeTruthy();
        });
        it('fail', () => {
            exists = false;
            return expect(
                service.add({ target: 'test-2', source: 'test' }),
            ).rejects.toThrow();
        });
    });
    it('delete', () => {
        expect(
            service.delete({ target: 'test-2', source: 'test' }),
        ).resolves.toBeTruthy();
        return expect(
            service.delete({ target: 'test-2', source: 'test' }),
        ).resolves.toBeTruthy();
    });
});
