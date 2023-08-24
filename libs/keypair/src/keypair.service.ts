import { ConfigService } from '@app/config';
import { Injectable, Logger } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs-extra';
import {
    Key,
    PrivateKey,
    WebStream,
    createMessage,
    decrypt,
    decryptKey,
    encrypt,
    generateKey,
    readKey,
    readMessage,
    readPrivateKey,
    sign,
    verify,
} from 'openpgp';
import { join } from 'path';
import { isEmpty } from 'ramda';

@Injectable()
export class KeypairService {
    private pri: Promise<PrivateKey>;
    private pub: Promise<Key>;
    constructor(private readonly config: ConfigService) {
        const { enable, path } = config.get<'key.storage'>('key.storage');
        if (!enable) {
            const privateKeyPath = join(path, 'key.pri');
            const pubKeyPath = join(path, 'key.pub');
            if (!existsSync(path)) {
                mkdirSync(path);
            }
            this.pri = readPrivateKey({
                armoredKey: readFileSync(privateKeyPath).toString(),
            })
                .then((key) => {
                    return decryptKey({
                        privateKey: key,
                        passphrase:
                            config.get<'key.passphrase'>('key.passphrase'),
                    });
                })
                .catch(() => {
                    Logger.error(`Not find ${privateKeyPath}`);
                    process.exit(-1);
                });
            this.pub = readKey({
                armoredKey: readFileSync(pubKeyPath).toString(),
            })
                .then((key) => key)
                .catch(() => {
                    Logger.error(`Not find ${pubKeyPath}`);
                    process.exit(-1);
                });
        }
    }
    async generate() {
        let pass = this.config.get<'key.passphrase'>('key.passphrase');
        const { path = './key' } =
            this.config.get<'key.storage'>('key.storage');
        if (isEmpty(pass)) {
            pass = randomBytes(64).toString('hex');
            Logger.error(`Not find passhrase.`);
            Logger.error(`Passhrase: ${pass}`);
            process.exit(-1);
        }
        const { publicKey, privateKey } = await generateKey({
            format: 'armored',
            type: 'ecc',
            passphrase: pass,
            userIDs: this.config.get<'key.userIDs'>('key.userIDs') ?? {},
            keyExpirationTime: this.config.get<'key.expire'>('key.expire'),
        });
        const privateKeyPath = join(path, 'key.pri');
        const pubKeyPath = join(path, 'key.pub');
        if (!existsSync(path)) {
            mkdirSync(path);
        }
        writeFileSync(pubKeyPath, publicKey);
        writeFileSync(privateKeyPath, privateKey);
        this.pub = readKey({ armoredKey: publicKey });
        this.pri = readPrivateKey({ armoredKey: privateKey });
    }
    async sign(data: any) {
        let standardizationData = String(data);
        if (typeof data === 'object') {
            standardizationData = JSON.stringify(data);
        }
        const msg = await createMessage({ text: standardizationData });
        return sign({ message: msg, signingKeys: await this.pri });
    }
    async verify(signedMessage: string) {
        const msg = await createMessage({ text: signedMessage });
        return verify({
            message: msg,
            verificationKeys: await this.pub,
        })
            .then((v) => v.signatures[0].verified)
            .catch(() => false);
    }
    async encrypt(message: any) {
        const msg = await createMessage({
            text:
                typeof message === 'string' ? message : JSON.stringify(message),
        });
        return await encrypt({
            message: msg,
            encryptionKeys: await this.pub,
            signingKeys: await this.pri,
        });
    }
    async decrypt(encryptMessage: string | WebStream<string>) {
        return await decrypt({
            message: await readMessage({ armoredMessage: encryptMessage }),
            decryptionKeys: await this.pri,
            verificationKeys: await this.pub,
        });
    }
}
