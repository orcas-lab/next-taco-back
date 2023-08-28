import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '../src/token.service';
import { JwtModule } from '@app/jwt';
import { ConfigModule } from '@app/config';
import { getRedisToken } from '@liaoliaots/nestjs-redis';

describe('TokenController', () => {
    let tokenService: TokenService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [JwtModule.use(), ConfigModule.forRoot('config.toml')],
            providers: [
                TokenService,
                {
                    provide: getRedisToken('default'),
                    useValue: {
                        del: jest.fn(),
                    },
                },
            ],
        }).compile();

        tokenService = app.get<TokenService>(TokenService);
    });

    it('should not be undefined', () => {
        expect(tokenService.sign({ tid: 'test' })).resolves.not.toBeUndefined();
    });
    it('should not be throw', async () => {
        const sign = await tokenService.sign({ tid: 'test' });
        return expect(sign).not.toBeNull();
    });
    it('decode', async () => {
        const sign = await tokenService.sign({ tid: 'test' });
        return expect(
            tokenService.decode(sign.access_token),
        ).resolves.toMatchObject({
            tid: 'test',
        });
    });
    it('revoke', () => {
        return expect(tokenService.revoke('test')).resolves.toBeTruthy();
    });
});
