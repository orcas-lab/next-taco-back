import { DynamicModule, Logger, Module } from '@nestjs/common';
import { KeysService } from './keys.service';
import { join, resolve } from 'path';
import { ECKeyPairOptions, generateKeyPairSync } from 'node:crypto';
import fs from 'node:fs';
import { PRI, PUB } from './constant';

@Module({
  providers: [KeysService],
  exports: [KeysService],
})
export class KeysModule {
  private static logger: Logger = new Logger('KeyModule');
  static use(global: boolean = false): DynamicModule {
    const root = resolve(__dirname);
    const data = join(root, 'data', 'keys');
    if (fs.existsSync(data)) {
      const priKey = fs.readFileSync(join(data, 'pri.key'));
      const pubKey = fs.readFileSync(join(data, 'pub.key'));
      return {
        module: KeysModule,
        providers: [
          {
            provide: PRI,
            useValue: priKey,
          },
          {
            provide: PUB,
            useValue: pubKey,
          },
          KeysService,
        ],
        exports: [KeysModule, KeysService],
        global,
      };
    }
    if (!fs.existsSync(join(root, 'data'))) {
      fs.mkdirSync(join(root, 'data'));
    }
    const { privateKey, publicKey } = generateKeyPairSync('ec', {
      namedCurve: 'sect239k1',
      publicKeyEncoding: {
        format: 'pem',
        type: 'spki',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    } as ECKeyPairOptions<'pem', 'pem'>);
    fs.writeFileSync(join(data, 'pri.key'), privateKey);
    fs.writeFileSync(join(data, 'pub.key'), publicKey);
    return {
      module: KeysModule,
      providers: [
        {
          provide: PRI,
          useValue: privateKey,
        },
        {
          provide: PUB,
          useValue: publicKey,
        },
        KeysService,
      ],
      exports: [KeysModule, KeysService],
      global,
    };
  }
}
