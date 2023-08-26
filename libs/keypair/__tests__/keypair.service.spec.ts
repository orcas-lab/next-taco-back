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
                pub: 'keys/pub.pem',
                pri: 'keys/pri.pem',
                passphrase: '',
            }),
        ).not.toThrow();
    });
    it('get pair should not be throw', () => {
        expect(() => service.keyPair).not.toThrow();
    });
});
