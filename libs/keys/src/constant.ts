import { ECKeyPairOptions, RSAKeyPairOptions } from 'node:crypto';

export const DEFAULT_EC_OPTIONS: ECKeyPairOptions<'pem', 'pem'> = {
  namedCurve: 'secp521r1',
  privateKeyEncoding: {
    format: 'pem',
    type: 'pkcs8',
  },
  publicKeyEncoding: {
    format: 'pem',
    type: 'spki',
  },
};

export const DEFAULT_RSA_OPTIONS: RSAKeyPairOptions<'pem', 'pem'> = {
  modulusLength: 4096,
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'taco',
  },
  publicKeyEncoding: {
    format: 'pem',
    type: 'spki',
  },
};
