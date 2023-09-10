import { Test, TestingModule } from '@nestjs/testing';
import { CmdProcessService } from '../src/cmd-process.service';

describe('CmdProcessService', () => {
    let service: CmdProcessService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CmdProcessService],
        }).compile();

        service = module.get<CmdProcessService>(CmdProcessService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('get', () => {
        expect(
            service.get('friend.add.sender', [{ reciver: 'test' }])[0],
        ).toMatchObject({ reciver: 'test' });
        expect(
            service.get(
                'friend.add.sender....................................................................................................',
                [{ reciver: 'test' }],
            )[0],
        ).toMatchObject({ reciver: 'test' });
    }, 60);
    const createLargeMeta = (depth: number) => {
        const chars = 'abcdefghijklmnopqrstuvwxyz'.split('');
        let obj: Record<string, any> = { value: 1 };
        for (let i = depth - 1; i >= 0; i--) {
            obj = {
                [chars[i]]: obj,
            };
        }
        return obj;
    };
    it('parse', () => {
        expect(
            service.parse(
                `module.fn.sender.${JSON.stringify(createLargeMeta(26))}`,
            ),
        ).toMatchObject({ meta: createLargeMeta(26) });
        expect(service.parse(`module.fn.sender.`)).toMatchObject({
            meta: {},
        });
    }, 60);
    it('invalidate', () => {
        expect(service._invalidate('module.fn.sender..........')).toBeTruthy();
        expect(service._invalidate('module.')).toBeFalsy();
        expect(service._invalidate('module.fn')).toBeFalsy();
        expect(service._invalidate('module.fn.reciver')).toBeTruthy();
        expect(service._invalidate('module...')).toBeFalsy();
    });
});
