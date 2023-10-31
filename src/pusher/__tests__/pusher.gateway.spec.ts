import { Test, TestingModule } from '@nestjs/testing';
import { PusherGateway } from '../pusher.gateway';
import { PusherService } from '../pusher.service';
import { JwtModule } from '@app/jwt';

describe('PusherGateway', () => {
    let gateway: PusherGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JwtModule.use()],
            providers: [
                PusherGateway,
                {
                    provide: PusherService,
                    useValue: {
                        persistence: jest.fn().mockResolvedValue({}),
                    },
                },
            ],
        }).compile();

        gateway = module.get<PusherGateway>(PusherGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});
