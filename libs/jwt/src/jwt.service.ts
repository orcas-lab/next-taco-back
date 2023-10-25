import { ConfigureService } from '@app/configure';
import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { SignOptions, VerifyOptions, sign, verify } from 'jsonwebtoken';

@Injectable()
export class JwtService {
    private privateKey: string;
    private publicKey: string;
    private Logger: Logger = new Logger('JWTService');
    constructor(private readonly config: ConfigureService) {
        this.privateKey = readFileSync(
            this.config.get('jwt.privateKeyPath'),
        ).toString();
        this.Logger.log('Load private key success');
        this.publicKey = readFileSync(
            this.config.get('jwt.privateKeyPath'),
        ).toString();
        this.Logger.log('Load public key success');
    }
    sign(data: string | Buffer | object, option: SignOptions) {
        return sign(data, this.privateKey, option);
    }
    verify<T>(token: string, option: VerifyOptions): T {
        return verify(token, this.publicKey, option) as T;
    }
}
