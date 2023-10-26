import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../account.service';
import { ConfigureModule } from '@app/configure';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '@app/entity';
import { MockRepositoryType, mockRepository } from '@app/mock';
import { Repository } from 'typeorm';
import { mock } from 'mockjs';
import { AccountError } from '@app/error';
import { JwtModule } from '@app/jwt';
import { getClusterToken } from '@liaoliaots/nestjs-redis';
import { useBCrypt } from '@app/bcrypto';
import { Profile } from '@app/entity/profile.entity';

describe('AccountService', () => {
    let service: AccountService;
    let repositoryMock: MockRepositoryType<Repository<Account>>;
    let profileMock: MockRepositoryType<Repository<Profile>>;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigureModule.forRoot('config.toml'), JwtModule.use()],
            providers: [
                {
                    provide: getClusterToken('default'),
                    useValue: {
                        set: jest.fn().mockResolvedValue(1),
                        expire: jest.fn().mockResolvedValue(1),
                        del: jest.fn().mockResolvedValue(1),
                    },
                },
                AccountService,
                {
                    provide: getRepositoryToken(Account),
                    useValue: mockRepository<typeof Account>(),
                },
                {
                    provide: getRepositoryToken(Profile),
                    useValue: mockRepository<typeof Profile>(),
                },
            ],
        }).compile();
        service = module.get<AccountService>(AccountService);
        repositoryMock = module.get(getRepositoryToken(Account));
        profileMock = module.get(getRepositoryToken(Profile));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    const registerData = mock({
        tid: '@guid',
        email: '@email',
        password: '@string',
        question: {
            q1: 'a1',
        },
        active: '@boolean',
        create_at: '@integer(1546300800000, 1893436800000)',
    });
    describe('register', () => {
        it('success', () => {
            repositoryMock.findOne.mockResolvedValue(null);
            repositoryMock.save.mockResolvedValue(registerData);
            return expect(
                service.register({
                    tid: registerData.tid,
                    password: useBCrypt(registerData.password, 'salt', 12),
                    email: '',
                    question: { q1: 'a1' },
                }),
            ).resolves.toStrictEqual(registerData);
        });
        it('fail', () => {
            repositoryMock.findOne.mockResolvedValue(registerData);
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
        it('success', () => {
            repositoryMock.findOne.mockResolvedValue({
                password: useBCrypt('123456', 'VG!ha(Rwa_xurpzyB4', 12),
            });
            return expect(
                service.login({
                    tid: registerData.tid,
                    password: '123456',
                }),
            ).resolves.not.toMatchObject({
                access_token: '',
                refresh_token: '',
            });
        });
        it('tid not exists', () => {
            repositoryMock.findOne.mockResolvedValue(null);
            return expect(
                service.login({ tid: 'not-exists', password: '0000' }),
            ).rejects.toThrow(AccountError.ACCOUNT_NOT_EXISTS);
        });
    });
    describe('delete account', () => {
        it('account not exists', () => {
            return expect(
                service.delete({
                    question: {},
                    tid: 'no-exists-account',
                }),
            ).rejects.toThrow(AccountError.ACCOUNT_NOT_EXISTS);
        });
        it('account exists but question is invalide', () => {
            const data = mock({
                tid: '@guid',
                email: '@email',
                password: '@string',
                question: {
                    q1: 'a2',
                },
                active: '@boolean',
                create_at: '@integer(1546300800000, 1893436800000)',
            });
            repositoryMock.findOne.mockResolvedValue(data);
            return expect(
                service.delete({
                    question: { q1: 'a1' },
                    tid: data.tid,
                }),
            ).rejects.toThrow(AccountError.QUESTION_INVALIDE);
        });
        it('success', () => {
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
            repositoryMock.findOne.mockResolvedValue(data);
            return expect(
                service.delete({
                    question: { q1: 'a1' },
                    tid: data.tid,
                }),
            ).resolves.toBeUndefined();
        });
    });
    describe('update password', () => {
        it('user not exists', () => {
            return expect(
                service.updatePassword({
                    question: {},
                    tid: 'no-exists-account',
                    password: '',
                }),
            ).rejects.toThrow(AccountError.ACCOUNT_NOT_EXISTS);
        });
        it('question invalide', () => {
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
            repositoryMock.findOne.mockResolvedValue(data);
            return expect(
                service.updatePassword({
                    question: {},
                    tid: data.tid,
                    password: '',
                }),
            ).rejects.toThrow(AccountError.QUESTION_INVALIDE);
        });
        it('success', () => {
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
            repositoryMock.findOne.mockResolvedValue(data);
            return expect(
                service.updatePassword({
                    question: data.question,
                    tid: data.tid,
                    password: '',
                }),
            ).resolves.toBeUndefined();
        });
    });
});
