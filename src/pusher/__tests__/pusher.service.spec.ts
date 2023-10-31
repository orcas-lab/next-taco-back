import { Test, TestingModule } from '@nestjs/testing';
import { PusherService } from '../pusher.service';
import { MockRepositoryType, mockRepository } from '@app/mock';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from '@app/entity';

describe('PusherService', () => {
    let service: PusherService;
    const repositorys: {
        message: MockRepositoryType<Repository<Message>>;
    } = {
        message: null,
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PusherService,
                {
                    provide: getRepositoryToken(Message),
                    useValue: mockRepository<typeof Message>(),
                },
            ],
        }).compile();

        service = module.get<PusherService>(PusherService);
        repositorys.message = module.get(getRepositoryToken(Message));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('persistence', () => {
        repositorys.message.save.mockResolvedValue('');
        expect(
            service.persistence({
                source: '',
                target: '',
                msg: '',
            }),
        ).resolves.toBeDefined();
    });
});
