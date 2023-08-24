import { Test, TestingModule } from '@nestjs/testing';
import { KeypairService } from '../src/keypair.service';
import { ConfigModule } from '@app/config';
import { existsSync } from 'fs-extra';

describe('KeypairService', () => {
    let service: KeypairService;
    const signs = [];
    const encyrptMessages = [];
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
        signs.push(await service.sign({}));
        signs.push(await service.sign('123123'));
        expect(service.sign({})).resolves.not.toThrow();
        return expect(service.sign('123123')).resolves.not.toThrow();
    });
    it('verify', () => {
        signs.map((v) => expect(service.verify(v)).resolves.not.toThrow());
    });
    it('encrypt', async () => {
        expect(service.encrypt('hello')).resolves.not.toThrow();
        encyrptMessages.push(await service.encrypt('hello'));
        return expect(
            service.encrypt({ text: 'hello' }),
        ).resolves.not.toThrow();
    });
    it('decrypt', () => {
        return expect(
            service.decrypt(encyrptMessages[0]),
        ).resolves.not.toThrow();
    });
});
