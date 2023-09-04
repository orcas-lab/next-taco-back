import { Test, TestingModule } from '@nestjs/testing';
import { KeypairService } from '../src/keypair.service';
import { ConfigModule } from '@app/config';

describe('KeypairService', () => {
    let service: KeypairService;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot('config.toml')],
            providers: [KeypairService],
        }).compile();

        service = module.get<KeypairService>(KeypairService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('read', () => {
        expect(() =>
            service.read({
                pub: 'keys/key.pub',
                pri: 'keys/key.pri',
                passphrase: '',
            }),
        ).not.toThrow();
    });
    it('get pair should not be throw', () => {
        expect(() => service.keyPair).not.toThrow();
    });
    describe('sign', () => {
        it('string', () => {
            expect(service.sign(true)).toBeDefined();
            expect(service.sign([])).toBeDefined();
            expect(service.sign('123')).toBeDefined();
            expect(service.sign(123)).toBeDefined();
            expect(service.sign({ value: 123 })).toBeDefined();
        });
        it('buf', () => {
            expect(service.sign(true, false)).toBeDefined();
            expect(service.sign([], false)).toBeDefined();
            expect(service.sign('123', false)).toBeDefined();
            expect(service.sign(123, false)).toBeDefined();
            expect(service.sign({ value: 123 }, false)).toBeDefined();
        });
    });
    describe('verify', () => {
        it('string', () => {
            const data = [true, [], '123', 123, { value: 123 }];
            const signs = data.map((v) => service.sign(v));
            for (let i = 0; i < signs.length; i++) {
                expect(service.verify(data[i], signs[i])).toBeTruthy();
            }
        });
    });
});
