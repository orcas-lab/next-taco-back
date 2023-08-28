import { KeypairService } from '@app/keypair';
import { Injectable } from '@nestjs/common';
import { SignOptions, VerifyOptions, decode, verify, sign } from 'jsonwebtoken';

@Injectable()
export class JwtService {
    constructor(private keypair: KeypairService) {}
    async sign(data: string | object | Buffer, options?: SignOptions) {
        const { pri } = this.keypair.keyPair;
        return sign(data, pri, options);
    }
    async verify(token: string, options?: VerifyOptions) {
        const { pub } = this.keypair.keyPair;
        return verify(token, pub, options);
    }
    async decode(
        token: string,
        options?: { json?: boolean; complete?: boolean },
    ) {
        return decode(token, options);
    }
}
