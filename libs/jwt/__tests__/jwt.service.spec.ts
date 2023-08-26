import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '../src/jwt.service';
import { KeypairModule } from '@app/keypair';

describe('JwtService', () => {
    let service: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [KeypairModule.forRoot()],
            providers: [JwtService],
        }).compile();

        service = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('sign', () => {
        expect(
            service.sign('123', { algorithm: 'ES512' }),
        ).resolves.toBeDefined();
    });
    it('verify', async () => {
        return expect(
            service.verify(await service.sign('123', { algorithm: 'ES512' }), {
                algorithms: ['ES512'],
            }),
        ).resolves.toBeDefined();
    });
    it('decode', async () => {
        return expect(
            service.decode(await service.sign('123', { algorithm: 'ES512' })),
        ).resolves.toBeDefined();
    });
});
