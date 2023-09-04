import { ConfigService } from '@app/config';
import { Injectable, Logger } from '@nestjs/common';
import { createSign } from 'crypto';
import { readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class KeypairService {
    private pri: string;
    private pub: string;
    private logger: Logger = new Logger('KeyPair');
    constructor(private readonly config: ConfigService) {
        if (
            this.config.get<'key.path.pub'>('key.path.pub') &&
            this.config.get<'key.path.pri'>('key.path.pri')
        ) {
            const { pri, pub } = this.read({
                pub: this.config.get<'key.path.pub'>('key.path.pub'),
                pri: this.config.get<'key.path.pri'>('key.path.pri'),
                passphrase: this.config.get<'key.passphrase'>('key.passphrase'),
            });
            this.pri = pri;
            this.pub = pub;
        }
    }
    read(options: { pub: string; pri: string; passphrase: string }) {
        const pubPath = resolve('.', options.pub);
        const priPath = resolve('.', options.pri);
        const armorPub = readFileSync(pubPath).toString('utf-8');
        const armorPri = readFileSync(priPath).toString('utf-8');
        return { pub: armorPub, pri: armorPri };
    }
    sign<T extends true | false = true>(msg: any, string?: T) {
        const sign = createSign('sm3');
        sign.write(typeof msg === 'string' ? msg : JSON.stringify(msg));
        const buf = sign.sign(this.pri, 'hex');
        return (string ? buf.toString() : buf) as T extends true
            ? string
            : Buffer;
    }
    get keyPair() {
        return {
            pri: this.pri,
            pub: this.pub,
            type: this.config.get<'key.type'>('key.type') ?? 'ES512',
        };
    }
}
