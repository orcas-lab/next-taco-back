import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from '../src/db.service';
import { DbModule } from '@app/db';

describe('DbService', () => {
    let service: DbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DbService],
            imports: [DbModule],
        }).compile();

        service = module.get<DbService>(DbService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
