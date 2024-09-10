import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '../src/jwt.service';
import { JWT_PRI_KEY_NAME, JWT_PUB_KEY_NAME } from '@app/constant';
import { readFileSync } from 'fs';
import { join } from 'path';
import { KeysModule, KeysService } from '@app/keys';
import { ConfigModule } from '@app/config';

describe('JwtService', () => {
    let service: JwtService;
    const sleep = (delay: number) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, delay);
        });
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot('config.toml'), KeysModule],
            providers: [JwtService],
        })
            .overrideProvider(KeysService)
            .useValue({
                jwt: {
                    pub: readFileSync(
                        join(process.cwd(), 'dist/data/keys/jwt.key.pub'),
                    ).toString(),
                    pri: readFileSync(
                        join(process.cwd(), 'dist/data/keys/jwt.key.pri'),
                    ).toString(),
                },
            })
            .compile();

        service = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('sign', () => {
        expect(
            service.sign(
                {
                    uid: 123,
                },
                '1d',
            ),
        ).toBeDefined();
    });
    it('verify', async () => {
        const notExpire = service.sign({ uid: 12 }, '1d');
        const expire = service.sign({ uid: 34 }, '1s');
        expect(service.verify(notExpire).fail).toBeFalsy();
        await sleep(1500);
        expect(service.verify(expire).fail).toBeTruthy();
        expect(service.verify(expire).name.toLowerCase()).toContain('expire');
    });
    it('decode', async () => {
        const notExpire = service.sign({ uid: 12 }, '1d');
        const expire = service.sign({ uid: 34 }, '1s');
        expect(service.decode<{ uid: 12 }>(notExpire).uid).toBe(12);
        await sleep(1500);
        expect(service.decode<{ uid: 34 }>(expire).uid).toBe(34);
    });
});
