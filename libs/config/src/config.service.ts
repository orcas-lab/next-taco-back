import { parse } from 'toml';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_KEY } from '@app/constant';

type Keys<T> = keyof T;
type Values<T> = T[Keys<T>];
export type ConfigTemplate<
  T = Configure,
  A = {
    [key in keyof T]: T[key];
  },
  B = {
    [key in keyof A]: A[key] extends object
      ?
          | `${Extract<key, string>}.${Exclude<
              Extract<keyof A[key], string>,
              keyof any[]
            >}`
          | (ConfigTemplate<A[key]> extends infer R
              ? `${Extract<key, string>}.${Extract<R, string>}`
              : never)
      : key;
  },
> = Exclude<keyof A, keyof any[]> | Values<B>;

export type GetTypeByTemplate<
  K extends string,
  obj = Configure,
> = K extends `${infer L}.${infer R}`
  ? L extends keyof obj
    ? GetTypeByTemplate<R, obj[L]>
    : never
  : K extends keyof obj
  ? obj[K]
  : never;

export interface Configure {
  app: {
    override: boolean;
  };
  keys: {
    type: 'ecc';
  };
  jwt: {
    access_token: {
      expire: string;
    };
    refresh_token: {
      expire: string;
    };
  };
}

@Injectable()
export class ConfigService {
  private configure: Configure;
  constructor(@Inject(CONFIG_KEY) private configRaw: string) {
    this.configure = parse(configRaw);
  }
  get<T extends ConfigTemplate>(key: T): GetTypeByTemplate<T> {
    const keys = key.split('.');
    let obj = this.configure[keys.shift()];
    for (const item of keys) {
      if (obj[item]) {
        obj = obj[item];
        continue;
      }
      return undefined;
    }
    return obj as unknown as GetTypeByTemplate<T>;
  }
}
