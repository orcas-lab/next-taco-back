import { Inject, Injectable } from '@nestjs/common';
import { PRI, PUB } from './constant';
import { createSign, createVerify } from 'node:crypto';

@Injectable()
export class KeysService {
  constructor(
    @Inject(PRI)
    private readonly privateKey: string,
    @Inject(PUB)
    private readonly publicKey: string,
  ) { }
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
