import { ConfigureService } from '@app/configure';
import { Injectable, Logger } from '@nestjs/common';
import { generateKeyPairSync, RSAKeyPairOptions } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { SignOptions, VerifyOptions, sign, verify } from 'jsonwebtoken';
import { resolve } from 'path';

@Injectable()
export class JwtService {
  private privateKey: string;
  private publicKey: string;
  private Logger: Logger = new Logger('JWTService');
  constructor(private readonly config: ConfigureService) {
    const root = __dirname;
    const keyRoot = resolve(root, 'keys');
    if (existsSync(keyRoot)) {
      this.Logger.warn(
        'dist/keys exists. If you want auto generate please delete it',
      );
    } else {
      const privateKeyPath = this.config.get('jwt.privateKeyPath');
      const publicKeyPath = this.config.get('jwt.publicKeyPath');
      const keyPairs = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        privateKeyEncoding: {
          format: 'pem',
          type: 'pkcs1',
        },
        publicKeyEncoding: {
          format: 'pem',
          type: 'pkcs1',
        },
      } as RSAKeyPairOptions<'pem', 'pem'>);
      if (existsSync(keyRoot)) {
        Logger.warn(`dist/keys exists, will skip`);
      } else {
        mkdirSync(keyRoot, { recursive: true });
        const { publicKey, privateKey } = keyPairs;
        writeFileSync(resolve(keyRoot, privateKeyPath), privateKey.toString());
        writeFileSync(resolve(keyRoot, publicKeyPath), publicKey.toString());
      }
    }
    this.privateKey = readFileSync(
      resolve(keyRoot, this.config.get('jwt.privateKeyPath')),
    ).toString();
    this.Logger.log('Load private key success');
    this.publicKey = readFileSync(
      resolve(keyRoot, this.config.get('jwt.publicKeyPath')),
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
