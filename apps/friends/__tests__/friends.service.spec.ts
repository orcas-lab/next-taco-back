import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from '../src/friends.service';
import { DbModule } from '@app/db';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '@app/schema/account.schema';
import { Friends, FriendsSchema } from '@app/schema/friends.schema';
import { ConfigModule } from '@app/config';
import mongoose from 'mongoose';
import { BlackList } from '@app/schema/black-list.schema';

describe('Friends Service', () => {
    let service: FriendsService;
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
                    {
                        name: Friends.name,
                        collection: Friends.name.toLowerCase(),
                        schema: FriendsSchema,
                    },
                    {
                        name: BlackList.name,
                        collection: Friends.name.toLowerCase(),
                        schema: FriendsSchema,
                    },
                ]),
                ConfigModule.forRoot('config.toml'),
            ],
            providers: [FriendsService],
        }).compile();
        const createFakeUser = (tid: string) => {
            return {
                nick: `${tid}`,
                tid: `${tid}`,
                password: '',
                sex: '',
                email: '',
                description: '',
                friend_total: 1,
            };
        };
        const instance = mongoose.connections[1];
        const accountModel = instance.models[Account.name];
        const friendModel = instance.models[Friends.name];
        for (let i = 1; i <= 100; i++) {
            await accountModel.insertMany([
                createFakeUser(`test-${i.toString()}`),
            ]);
            await friendModel.insertMany({
                source: 'tester',
                target: `test-${i.toString()}`,
            });
        }
        await accountModel.insertMany(createFakeUser('tester'));
        service = app.get<FriendsService>(FriendsService);
    }, 60 * 1000);
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('has friends', () => {
        return expect(
            service._isFriend('source', 'target'),
        ).resolves.toBeFalsy();
    });
    describe('accept', () => {
        it('is friend', () => {
            service._isFriend = async () => true;
            return expect(
                service.accept({ source: 'source', target: 'target' }),
            ).resolves.toBeTruthy();
        });
        it('not friends', () => {
            service._isFriend = async () => true;
            return expect(
                service.accept({ source: 'tester', target: 'test-1' }),
            ).resolves.toBeTruthy();
        });
    });
    it('refuse', () => {
        return expect(service.refuse()).resolves.toBeTruthy();
    });
    it('get friend list', async () => {
        expect(
            service.getFriendList({ tid: 'tester', page: 1 }),
        ).resolves.toMatchObject({ page: 1 });
        expect(
            (await service.getFriendList({ tid: 'tester', page: 1 })).friends
                .length,
        ).not.toBe(0);
        return expect(
            (await service.getFriendList({ tid: 'tester', page: 1 })).friends
                .length,
        ).not.toBe(0);
    });
    it('delete', async () => {
        expect(
            service.deleteFriend({ source: 'tester', target: 'test-1' }),
        ).resolves.toBeTruthy();
        return expect(
            service.deleteFriend({
                source: 'tester',
                target: 'test-1145141919810',
                black_list: true,
            }),
        ).resolves.toBeTruthy();
    });
    it('update', async () => {
        expect(
            service.update({ source: 'tester', target: 'test-2' }),
        ).resolves.toBeTruthy();
        expect(
            service.update({
                source: 'tester',
                target: 'test-2',
                tag: 'test',
            }),
        ).resolves.toBeTruthy();
        expect(
            (
                await service.getFriendList({ tid: 'tester', page: 1 })
            ).friends.filter((v) => v.profile.tid === 'test-2')[0],
        ).toMatchObject({ tag: 'test' });
        expect(
            service.update({
                source: 'tester',
                target: 'test-2',
                pet_name: 'test_',
            }),
        ).resolves.toBeTruthy();
        return expect(
            (
                await service.getFriendList({ tid: 'tester', page: 1 })
            ).friends.filter((v) => v.profile.tid === 'test-2')[0],
        ).toMatchObject({ tag: 'test', pet_name: 'test_' });
    });
});
