import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import providers from '@app/clients-provider';

describe('User Service', () => {
    let service: UserService;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: providers.USER_SERVICE.name,
                    useValue: {
                        getService: () => ({
                            profile: jest.fn().mockResolvedValue(true),
                            updateProfile: jest.fn().mockResolvedValue(true),
                        }),
                    },
                },
            ],
        }).compile();
        service = module.get(UserService);
    });
    it('get profile', () => {
        return expect(service.profile({ tid: 'test' })).resolves.not.toThrow();
    });
    it('update profile', () => {
        expect(
            service.update({ tid: 'test', profile: {} } as any),
        ).resolves.toBe(true);
        return expect(
            service.update({ tid: 'test', profile: { sex: 'other' } as any }),
        ).resolves.toBe(true);
    });
});
