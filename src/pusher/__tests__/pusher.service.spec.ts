import { Test, TestingModule } from '@nestjs/testing';
import { PusherService } from '../pusher.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from '@app/entity';
import { AutoDatabaseModule } from '@app/auto-database';
import { ConfigureModule } from '@app/configure';
import { JwtModule } from '@app/jwt';
import { mockRepository, MockRepositoryType } from '@app/mock';
import { Repository } from 'typeorm';

describe('PusherService', () => {
    let service: PusherService;
    let repoMock: MockRepositoryType<Repository<Message>>;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JwtModule.use(), ConfigureModule.forRoot('config.toml')],
            providers: [
                PusherService,
                {
                    provide: getRepositoryToken(Message),
                    useValue: mockRepository<typeof Message>(),
                },
            ],
        }).compile();

        service = module.get<PusherService>(PusherService);
        repoMock = module.get(getRepositoryToken(Message));
    }, 60 * 1000);

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('persistence', () => {
        repoMock.save.mockImplementation((args) => Promise.resolve(args));
        expect(
            service.persistence({
                source: '',
                target: '',
                msg: '',
            }),
        ).resolves.toBeDefined();
    });
});
