import { Test, TestingModule } from '@nestjs/testing';
import { AvatarService } from './avatar.service';
import { AVATAR_INSTANCE } from './instance';

describe('AvatarService', () => {
    let service: AvatarService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AvatarService,
                {
                    provide: AVATAR_INSTANCE,
                    useValue: {
                        width: 200,
                        height: 200,
                    },
                },
            ],
        }).compile();

        service = module.get<AvatarService>(AvatarService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('generate pixel', () => {
        for (let i = 0; i < 10; i++) {
            expect(
                service.pixel(`hello-world_${i}`, './tmp', 'png'),
            ).resolves.not.toBeUndefined();
        }
    }, 200);
});
