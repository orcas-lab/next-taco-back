import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from '../friends.service';
import { ConfigureModule } from '@app/configure';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BlackList, Friend, Profile, Request } from '@app/entity';
import { MockRepositoryType, mockRepository } from '@app/mock';
import { Repository } from 'typeorm';
import { FriendError } from '@app/error';
import { RMQModule } from 'nestjs-rmq';

describe('FriendsService', () => {
    let service: FriendsService;
    let rid: string;
    const repositorys: {
        friends: MockRepositoryType<Repository<Friend>>;
        request: MockRepositoryType<Repository<Request>>;
        blackList: MockRepositoryType<Repository<BlackList>>;
        profile: MockRepositoryType<Repository<Profile>>;
    } = {
        friends: null,
        request: null,
        blackList: null,
        profile: null,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigureModule.forRoot('config.toml'),
                RMQModule.forTest({}),
            ],
            providers: [
                FriendsService,
                {
                    provide: getRepositoryToken(Profile),
                    useValue: mockRepository<typeof Profile>(),
                },
                {
                    provide: getRepositoryToken(Request),
                    useValue: mockRepository<typeof Request>(),
                },
                {
                    provide: getRepositoryToken(BlackList),
                    useValue: mockRepository<typeof BlackList>(),
                },
                {
                    provide: getRepositoryToken(Friend),
                    useValue: mockRepository<typeof Friend>(),
                },
            ],
        }).compile();
        service = module.get<FriendsService>(FriendsService);
        repositorys.blackList = module.get(getRepositoryToken(BlackList));
        repositorys.friends = module.get(getRepositoryToken(Friend));
        repositorys.profile = module.get(getRepositoryToken(Profile));
        repositorys.request = module.get(getRepositoryToken(Request));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('send add friend request', async () => {
        rid = (
            await service.sendAddFriendRequest({
                source: 'test-1',
                target: 'test-2',
            })
        ).rid;
        for (let i = 0; i < 10; i++) {
            expect(
                service.sendAddFriendRequest({
                    source: 'test-1',
                    target: 'test-2',
                }),
            ).resolves.toBeDefined();
        }
        return expect(rid).not.toBeUndefined();
    });
    it('accept', () => {
        repositorys.friends.findOne.mockResolvedValue({
            source: 'test-1',
            target: 'test-2',
        });
        repositorys.request.findOne.mockResolvedValue({
            source: 'test-1',
            target: 'test-2',
            expire_at: new Date().getTime() + 1000 * 60 * 60,
        } as Request);
        return expect(service.accept({ rid }, '')).resolves.not.toThrow();
    });
    it('accept but is null', () => {
        repositorys.request.findOne.mockResolvedValue(null);
        expect(service.accept({ rid }, '')).rejects.toThrow(
            FriendError.CAN_NOT_FIND_REQ,
        );
    });
    it('accept but is expired', () => {
        repositorys.request.findOne.mockResolvedValue({
            source: 'test-1',
            target: 'test-2',
            expire_at: new Date().getTime() - 1000 * 60 * 60,
        } as Request);
        expect(service.accept({ rid }, '')).rejects.toThrow(
            FriendError.REQUEST_EXPIRED,
        );
    });
    it('reject', () => {
        repositorys.friends.findOne.mockResolvedValue({
            source: 'test-1',
            target: 'test-2',
        });
        repositorys.request.findOne.mockResolvedValue({
            source: 'test-1',
            target: 'test-2',
            expire_at: new Date().getTime() + 1000 * 60 * 60,
        } as Request);
        return expect(service.reject({ rid }, '')).resolves.not.toThrow();
    });
    it('reject but is null', () => {
        repositorys.request.findOne.mockResolvedValue(null);
        expect(service.reject({ rid }, '')).rejects.toThrow(
            FriendError.CAN_NOT_FIND_REQ,
        );
    });
    it('reject but is expired', () => {
        repositorys.request.findOne.mockResolvedValue({
            source: 'test-1',
            target: 'test-2',
            expire_at: new Date().getTime() - 1000 * 60 * 60,
        } as Request);
        expect(service.reject({ rid }, '')).rejects.toThrow(
            FriendError.REQUEST_EXPIRED,
        );
    });

    it('delete', () => {
        expect(
            service.deleteFriend({
                source: '',
                target: '',
                ban: false,
                type: 'single',
            }),
        ).resolves.toBeUndefined();
        expect(
            service.deleteFriend({
                source: '',
                target: '',
                ban: true,
                type: 'single',
            }),
        ).resolves.toBeUndefined();
        expect(
            service.deleteFriend({
                source: '',
                target: '',
                ban: false,
                type: 'both',
            }),
        ).resolves.toBeUndefined();
        expect(
            service.deleteFriend({
                source: '',
                target: '',
                ban: true,
                type: 'single',
            }),
        ).resolves.toBeUndefined();
    });
    it('update friend', () => {
        expect(
            service.updateFriend({
                source: '',
                target: '',
                nick: '',
            }),
        ).resolves.toBeUndefined();
    });
    it('get friends', () => {
        repositorys.profile.findOne.mockResolvedValue({ friends_total: 0 });
        expect(service.getFriends('', 1)).resolves.not.toBeUndefined();
    });
});
