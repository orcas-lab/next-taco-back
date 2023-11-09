import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from '../requests.service';
import { MockRepositoryType, mockRepository } from '@app/mock';
import { Repository } from 'typeorm';
import { Request } from '@app/entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RequestsService', () => {
    let service: RequestsService;
    let repository: MockRepositoryType<Repository<Request>>;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RequestsService,
                {
                    provide: getRepositoryToken(Request),
                    useValue: mockRepository<typeof Request>(),
                },
            ],
        }).compile();

        service = module.get<RequestsService>(RequestsService);
        repository = module.get(getRepositoryToken(Request));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should not be throw', () => {
        repository.findBy.mockResolvedValue([]);
        expect(service.findAll('')).resolves.toStrictEqual([]);
    });
});
