import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../account.service';
import providers from '@app/clients-provider';

describe('AccountService', () => {
    let service: AccountService;
    let exists = true;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountService,
                {
                    provide: providers.ACCOUNT_SERVICE.name,
                    useValue: {
                        getService: () => {
                            return {
                                accountExists: () => exists,
                                addUser: jest.fn().mockResolvedValue(true),
                                changePassword: jest
                                    .fn()
                                    .mockResolvedValue(true),
                                deleteAccount: jest.fn(),
                                register: jest.fn(),
                            };
                        },
                    },
                },
                {
                    provide: providers.TOKEN_SERVICE.name,
                    useValue: {
                        getService: () => {
                            return {
                                sign: jest.fn(),
                            };
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<AccountService>(AccountService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('register', () => {
        return expect(
            service.register({
                tid: 'test',
                nick: 'test',
                birthday: '1234-2-7',
                password: '123456789',
                email: 'test@no-reply.com',
                sex: 'other',
                question: {},
            }),
        ).resolves.not.toThrow();
    });
    it('login', () => {
        expect(
            service.login({
                tid: 'test',
                password: '',
            }),
        ).resolves.not.toStrictEqual({});
        exists = false;
        expect(
            service.login({
                tid: 'test',
                password: '',
            }),
        ).rejects.toThrow();
    });
    it('change password', () => {
        return expect(
            service.changePassword('1', { new_pass: '123', question: {} }),
        ).resolves.not.toThrow();
    });
    it('forget password', () => {
        return expect(
            service.forgetPassword({ tid: '1', new_pass: '123', question: {} }),
        ).resolves.not.toThrow();
    });
    it('delete', () => {
        return expect(service.delete({ tid: '1' })).resolves.not.toThrow();
    });
});
