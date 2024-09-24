import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './key.factory';
import { join } from 'node:path';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { DEFAULT_EC_OPTIONS, DEFAULT_RSA_OPTIONS } from './constant';
import {
  createSign,
  createVerify,
  ECKeyPairOptions,
  generateKeyPairSync,
  RSAKeyPairOptions,
} from 'node:crypto';
@Injectable()
export class KeysService {
  private keyMap: Map<
    string,
    {
      public: string;
      private: string;
    }
  > = new Map();
  private readonly logger: LoggerService = new Logger('Keys');
  private root: string = process.cwd();
  private data: string = join(this.root, 'data');
  private keys: string = join(this.data);
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: Partial<typeof OPTIONS_TYPE>,
  ) {
    const data = this.data;
    const keys = this.keys;
    const {
      type = 'ec',
      ec = DEFAULT_EC_OPTIONS,
      rsa = DEFAULT_RSA_OPTIONS,
    } = this.options;
    if (!existsSync(data)) {
      this.logger.warn(`Not find ${data} will mkdir ${data}`);
      mkdirSync(data);
    }
    if (!existsSync(keys)) {
      this.logger.warn(`Not find ${keys} will mkdir ${keys}`);
      mkdirSync(keys);
      const { publicKey, privateKey } = this.generate(
        'server',
        type,
        type === 'ec' ? ec : rsa,
      );
      writeFileSync(join(keys, 'server.public'), publicKey);
      writeFileSync(join(keys, 'server.private'), privateKey);
    } else {
      const keyFiles = readdirSync(keys);
      const keyFilesCount = Math.floor(keyFiles.length / 2);
      this.logger.debug(
        `Find ${keyFiles.length} key file${keyFilesCount > 2 ? 's' : ''}`,
      );
      for (const keyFile of keyFiles) {
        const [name, type] = keyFile.split('.');
        const keyPath = join(keys, keyFile);
        if (!this.keyMap.has(name)) {
          this.keyMap.set(name, {
            public: '',
            private: '',
          });
        }
        this.keyMap.get(name)[type] = readFileSync(keyPath).toString();
      }
    }
  }
  generate<T extends 'ec' | 'rsa'>(
    name: string,
    type: T,
    options: T extends 'ec'
      ? ECKeyPairOptions<'pem', 'pem'>
      : RSAKeyPairOptions<'pem', 'pem'>,
    write: boolean = false,
  ) {
    const { publicKey, privateKey } = generateKeyPairSync(
      type as any,
      options as any,
    );
    this.keyMap.set(name, {
      public: publicKey,
      private: privateKey,
    });
    if (write) {
      writeFileSync(join(this.keys, `${name}.public`), publicKey);
      writeFileSync(join(this.keys, `${name}.private`), privateKey);
    }
    return { publicKey, privateKey };
  }

  sign(keyName: string, data: string) {
    if (!this.keyMap.has(keyName)) {
      throw new Error(`Not find ${keyName}`);
    }
    const privateKey = this.keyMap.get(keyName).private;
    const sign = createSign('RSA-SHA256');
    const signature = sign.update(data).sign(privateKey, 'hex');
    return signature;
  }
  verify(keyName: string, data: any, signature: string) {
    if (!this.keyMap.has(keyName)) {
      throw new Error(`Not find ${keyName}`);
    }
    const publicKey = this.keyMap.get(keyName).public;
    const verify = createVerify('RSA-SHA256');
    return verify
      .update(data, 'ascii')
      .verify(Buffer.from(publicKey, 'ascii'), Buffer.from(signature, 'hex'));
  }
}
