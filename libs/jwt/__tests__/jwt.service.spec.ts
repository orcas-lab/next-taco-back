import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '../src/jwt.service';
import { ConfigureModule } from '@app/configure';

describe('JwtService', () => {
    let service: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigureModule.forRoot('config.toml')],
            providers: [JwtService],
        }).compile();

        service = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('sign success', () => {
        expect(
            service.sign({ a: '1' }, { algorithm: 'RS256', expiresIn: '1day' }),
        ).toBeDefined();
        expect(
            service.sign(
                { a: '1' },
                { algorithm: 'RS256', expiresIn: '1days' },
            ),
        ).toBeDefined();
    });
    it('verify success', () => {
        expect(
            service.verify(
                service.sign(
                    { a: '1' },
                    { algorithm: 'RS256', expiresIn: '1days' },
                ),
                { algorithms: ['RS256'] },
            ),
        ).toMatchObject({ a: '1' });
    });
});
