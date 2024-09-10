import { resolve } from 'node:path';

export const CONFIG_KEY = Symbol();
export const JWT_PUB_KEY_NAME = 'jwt.key.pub';
export const JWT_PRI_KEY_NAME = 'jwt.key.pri';

export const SERVER_PUB_KEY_NAME = 'sign.key.pub';
export const SERVER_PRI_KEY_NAME = 'sign.key.pri';

export const JWT_KEY = Symbol();
export const ROOT = resolve(__dirname);
export const DATA_ROOT = resolve(ROOT, 'data');
export const KEY_ROOT = resolve(DATA_ROOT, 'keys');
