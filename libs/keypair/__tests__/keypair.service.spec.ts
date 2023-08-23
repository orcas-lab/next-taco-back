import { Test, TestingModule } from '@nestjs/testing';
import { KeypairService } from '../src/keypair.service';
import { ConfigModule } from '@app/config';
import { existsSync } from 'fs-extra';

describe('KeypairService', () => {
    let service: KeypairService;
    const signs = [];
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
    it('generate', async () => {
        expect(await service.generate()).toBeUndefined();
        expect(existsSync('./keys/key.pri')).toBeTruthy();
        return expect(existsSync('./keys/key.pub')).toBeTruthy();
    });
    it('sign', async () => {
        expect(service.sign({})).resolves.not.toThrow();
        signs.push(await service.sign({}));
        expect(service.sign('123123')).resolves.not.toThrow();
        signs.push(await service.sign('123123'));
    });
    it('verify', () => {
        signs.map((v) => expect(service.verify(v)).resolves.not.toThrow());
    });
});
