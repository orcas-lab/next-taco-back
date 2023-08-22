import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../src/config.service';
import { ConfigModule } from '@app/config';

describe('ConfigService', () => {
    let service: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot('config.toml')],
            providers: [],
        }).compile();

        service = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('get', () => {
        expect(service.get<boolean>('cluster.enable')).toBeDefined();
        expect(() =>
            service.get<boolean>('cluster.undefined' as any),
        ).not.toThrow();
        expect(service.get<boolean>('cluster.undefined' as any)).toBe(null);
    });
});
