import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../src/redis.service';
import { RedisModule } from '@app/redis';

describe('RedisService', () => {
    let service: RedisService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [RedisModule],
            providers: [RedisService],
        }).compile();

        service = module.get<RedisService>(RedisService);
    });

    it(
        'should be defined',
        () => {
            expect(service).toBeDefined();
        },
        30 * 1000,
    );
});
