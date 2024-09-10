import { ECKeyPairOptions, generateKeyPairSync, KeyObject } from 'crypto';

export const keyGen = () => {
  const { publicKey, privateKey } = generateKeyPairSync('ec', {
    namedCurve: 'secp256k1',
    publicKeyEncoding: {
      format: 'pem',
      type: 'spki',
    },
    privateKeyEncoding: {
      format: 'pem',
      type: 'pkcs8',
    },
  } as ECKeyPairOptions<'pem', 'pem'>);
  const pubKeyString =
    (publicKey as KeyObject | string) instanceof KeyObject
      ? publicKey.toString()
      : publicKey;
  const priKeyString =
    (privateKey as KeyObject | string) instanceof KeyObject
      ? privateKey.toString()
      : privateKey;
  return { pubKeyString, priKeyString };
};
