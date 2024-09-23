import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import {
  createSign,
  createVerify,
  ECKeyPairOptions,
  generateKeyPairSync,
  RSAKeyPairOptions,
} from 'node:crypto';
import { MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './key.factory';
import { join } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

@Injectable()
export class KeysService {
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly logger: LoggerService = new Logger('Keys');
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: typeof OPTIONS_TYPE,
  ) {
    const root = process.cwd();
    const keys = join(root, 'data', 'keys');
    if (!existsSync(join(root, 'data'))) {
      mkdirSync(join(root, 'data'));
    }
    if (!existsSync(keys)) {
      mkdirSync(keys);
    }
    const pubKeyPath = join(keys, 'key.pub');
    const priKeyPath = join(keys, 'key.pri');
    if (options.type !== 'ec' && options.type !== 'rsa') {
      this.logger.error(
        `config.key.type should be ec or rsa but find ${options.type}`,
      );
      process.exit(-1);
    }
    let publicKey = '';
    let privateKey = '';
    if (!existsSync(pubKeyPath) || !existsSync(priKeyPath)) {
      const keyPair = this.generateKey(options.type);
      publicKey = keyPair.publicKey;
      privateKey = keyPair.privateKey;
    }
    if (!existsSync(pubKeyPath)) {
      this.logger.debug(`Not find key.pub`);
      writeFileSync(pubKeyPath, publicKey);
      this.logger.debug(`write key.pub success!`);
      this.publicKey = publicKey;
    } else {
      this.logger.debug(`Load public key`);
      this.publicKey = readFileSync(pubKeyPath).toString();
      this.logger.debug(`Load public key success`);
    }
    if (!existsSync(priKeyPath)) {
      this.logger.debug(`Not find key.pri`);
      writeFileSync(priKeyPath, privateKey);
      this.logger.debug(`write key.pri success!`);
      this.privateKey = privateKey;
    } else {
      this.logger.debug(`Load private key`);
      this.privateKey = readFileSync(priKeyPath).toString();
      this.logger.debug(`Load private key success`);
    }
  }
  private generateEcKeyPair(namedCurve: string) {
    return generateKeyPairSync('ec', {
      namedCurve,
      publicKeyEncoding: {
        format: 'pem',
        type: 'spki',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    } as ECKeyPairOptions<'pem', 'pem'>);
  }
  private generateRsaKeyPair() {
    if (!this.options.rsa) {
      this.logger.warn(
        `key.type is rsa, but key.rsa is undefined, will use default options`,
      );
    }
    const DEFAULT_RSA_OPTIONS = {
      modulusLength: 4096, // 512
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: 'taco',
      },
    } as RSAKeyPairOptions<'pem', 'pem'>;
    const { rsa } = this.options;
    return generateKeyPairSync('rsa', rsa ?? DEFAULT_RSA_OPTIONS);
  }
  private generateKey(type: 'ec' | 'rsa') {
    this.logger.debug(`Will generate ${type} key`);
    if (type === 'ec') {
      return this.generateEcKeyPair(this.options.ec.nameCurved);
    }
    if (type === 'rsa') {
      return this.generateRsaKeyPair();
    }
    this.logger.error(`Type should be ec or rsa, but find ${type}`);
    process.exit(-1);
  }
  sign(data: any) {
    const sign = createSign('RSA-SHA256');
    const signature = sign.update(data).sign(this.privateKey, 'hex');
    return signature;
  }
  verify(data: any, signature: string) {
    const verify = createVerify('RSA-SHA256');
    return verify
      .update(data, 'ascii')
      .verify(
        Buffer.from(this.publicKey, 'ascii'),
        Buffer.from(signature, 'hex'),
      );
  }
}
