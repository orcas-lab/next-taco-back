import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '../src/token.service';
import { JwtModule } from '@app/jwt';
import { ConfigModule } from '@app/config';

describe('TokenController', () => {
    let tokenService: TokenService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [JwtModule.use(), ConfigModule.forRoot('config.toml')],
            providers: [TokenService],
        }).compile();

        tokenService = app.get<TokenService>(TokenService);
    });

    it('should not be undefined', () => {
        expect(tokenService.sign({ tid: 'test' })).resolves.not.toBeUndefined();
    });
    it('should not be throw', async () => {
        const sign = await tokenService.sign({ tid: 'test' });
        console.log(sign);
        return expect(sign).not.toBeNull();
    });
});
