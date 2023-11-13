import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../account.controller';
import { AccountService } from '../account.service';
import { ConfigureModule } from '@app/configure';
import { JwtModule } from '@app/jwt';

describe('AccountController', () => {
    let controller: AccountController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigureModule.forRoot('config.toml'), JwtModule.use()],
            controllers: [AccountController],
            providers: [
                {
                    provide: AccountService,
                    useValue: {
                        login: jest.fn().mockResolvedValue(''),
                        register: jest.fn().mockResolvedValue(''),
                        delete: jest.fn().mockResolvedValue(''),
                        updatePassword: jest.fn().mockResolvedValue(''),
                    },
                },
            ],
        }).compile();

        controller = module.get<AccountController>(AccountController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('login', () => {
        expect(
            controller.login({ tid: '', password: '' }),
        ).resolves.toBeDefined();
    });
    it('register', () => {
        expect(
            controller.register({
                email: '',
                password: '',
                tid: '',
                question: {},
                avatar: '',
            }),
        ).resolves.toBeDefined();
    });
    it('delete', () => {
        expect(controller.delete('', { question: {} })).resolves.toBeDefined();
    });
    it('update password', () => {
        expect(
            controller.changePassword('', {
                question: {},
                password: '',
            }),
        ).resolves.toBeDefined();
    });
});
