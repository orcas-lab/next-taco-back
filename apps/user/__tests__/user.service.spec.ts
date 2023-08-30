import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user.service';
import { DbModule } from '@app/db';
import { getModelToken } from '@nestjs/mongoose';
import { Account } from '@app/schema/account.schema';
import { ConfigModule } from '@app/config';

describe('UserService', () => {
    let service: UserService;
    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [DbModule, ConfigModule.forRoot('config.toml')],
            providers: [
                UserService,
                {
                    provide: getModelToken(Account.name),
                    useValue: {
                        findOne: () => {
                            return {
                                lean: () => {
                                    return {
                                        exec: jest.fn(),
                                    };
                                },
                            };
                        },
                        findOneAndUpdate: () => {
                            return {
                                lean: () => {
                                    return {
                                        exec: jest.fn(),
                                    };
                                },
                            };
                        },
                    },
                },
            ],
        }).compile();
        service = app.get<UserService>(UserService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('get profile', () => {
        return expect(service.profile('test')).resolves.not.toBeNull();
    });
    it('update profile', () => {
        return expect(
            service.updateProfile({
                tid: 'test',
                profile: {
                    description: '',
                    email: '',
                    locaion: '',
                    nick: '',
                    sex: '',
                },
            }),
        ).resolves.toBeTruthy();
    });
});
