import { Test, TestingModule } from '@nestjs/testing';
import { AutoRedisService } from './auto-redis.service';

describe('AutoRedisService', () => {
    let service: AutoRedisService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AutoRedisService],
        }).compile();

        service = module.get<AutoRedisService>(AutoRedisService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
