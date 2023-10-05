import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user.service';
import { DbModule } from '@app/db';
import { getModelToken } from '@nestjs/mongoose';
import { Account } from '@app/schema/account.schema';
import { ConfigModule } from '@app/config';

describe('UserService', () => {
    let service: UserService;
    let ans = true;
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
                                        exec: () => ans,
                                    };
                                },
                            };
                        },
                        findOneAndUpdate: () => {
                            return {
                                lean: () => {
                                    return {
                                        exec: () => true,
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
        expect(service.profile('test')).resolves.not.toBeNull();
        ans = null;
        return expect(service.profile('test')).rejects.toThrow();
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
                    reputation: 5,
                    tid: '',
                },
            }),
        ).resolves.toBeTruthy();
    });
});
