import { Test, TestingModule } from '@nestjs/testing';
import { NoticeService } from '../src/notice.service';
import { KeypairModule } from '@app/keypair';
import { ConfigModule } from '@app/config';
import { memoryRedis } from '@app/redis';
import { getRedisToken } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Notice } from '@app/interface/notice.interface';

describe('Notice Serivce', () => {
    let service: NoticeService;
    const notices: Promise<Notice>[] = [];
    beforeAll(async () => {
        await memoryRedis();
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot('config.toml'),
                KeypairModule.forRoot(),
            ],
            providers: [
                NoticeService,
                {
                    provide: getRedisToken('default'),
                    useValue: new Redis(),
                },
            ],
        }).compile();
        service = app.get(NoticeService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('add notice', () => {
        notices.push(
            service.createNotice({
                sender: 'test',
                reciver: 'test-2',
                message: 'bye',
                group: false,
            }),
        );
        notices.push(
            service.createNotice({
                sender: 'test',
                reciver: 'test-2',
                message: 'bye-2',
                group: false,
            }),
        );
        expect(notices[0]).resolves.toBeDefined();
        return expect(notices[1]).resolves.toBeDefined();
    });
    it('update notice', async () => {
        return expect(
            service.updateNotice({
                nid: (await notices[0]).nid,
                notice: { message: 'before update' },
            }),
        ).resolves.toBeUndefined();
    });
    it('list notices', async () => {
        return expect(
            service.listNotice({ tid: 'test-2', page: 1 }),
        ).resolves.toMatchObject({
            notices: [
                {
                    sender: 'test',
                    reciver: 'test-2',
                    message: 'before update',
                    group: false,
                },
                {
                    sender: 'test',
                    reciver: 'test-2',
                    message: 'bye-2',
                    group: false,
                },
            ],
        });
    });
});
