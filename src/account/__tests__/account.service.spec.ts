import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../account.service';
import { ConfigureModule } from '@app/configure';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '@app/entity';
import { MockRepositoryType, mockRepository } from '@app/mock';
import { Repository } from 'typeorm';
import { mock } from 'mockjs';
import exp from 'constants';
import { AccountError } from '@app/error';
import { JwtModule } from '@app/jwt';
import { getClusterToken } from '@liaoliaots/nestjs-redis';

describe('AccountService', () => {
    let service: AccountService;
    let repositoryMock: MockRepositoryType<Repository<Account>>;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigureModule.forRoot('config.toml'), JwtModule.use()],
            providers: [
                {
                    provide: getClusterToken('default'),
                    useValue: {
                        set: jest.fn().mockResolvedValue(1),
                        expire: jest.fn().mockResolvedValue(1),
                    },
                },
                AccountService,
                {
                    provide: getRepositoryToken(Account),
                    useValue: mockRepository<typeof Account>(),
                },
            ],
        }).compile();
        service = module.get<AccountService>(AccountService);
        repositoryMock = module.get(getRepositoryToken(Account));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('register', () => {
        const data = mock({
            tid: '@guid',
            email: '@email',
            password: '@string',
            question: {
                q1: 'a1',
            },
            active: '@boolean',
            create_at: '@integer(1546300800000, 1893436800000)',
        });
        it('success', () => {
            repositoryMock.findOne.mockResolvedValue(null);
            repositoryMock.save.mockResolvedValue(data);
            return expect(
                service.register({
                    tid: '',
                    password: '',
                    email: '',
                    question: { q1: 'a1' },
                }),
            ).resolves.toStrictEqual(data);
        });
        it('fail', () => {
            repositoryMock.findOne.mockResolvedValue(data);
            return expect(
                service.register({
                    tid: '',
                    password: '',
                    email: '',
                    question: { q1: 'a1' },
                }),
            ).rejects.toThrow(AccountError.ACCOUNT_EXISTS);
        });
    });
    describe('login', () => {
        const data = mock({
            tid: '@guid',
            email: '@email',
            password: '@string',
            question: {
                q1: 'a1',
            },
            active: '@boolean',
            create_at: '@integer(1546300800000, 1893436800000)',
        });
        it('success', () => {
            repositoryMock.findOne.mockResolvedValue(data);
            return expect(
                service.login({ tid: data.tid, password: data.password }),
            ).resolves.not.toMatchObject({
                access_token: '',
                refresh_token: '',
            });
        });
    });
});
