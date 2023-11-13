import { ClusterNode, ClusterOptions } from 'ioredis';

export interface ConfigOption {
    api: {
        prefix: string;
    };
    asset: {
        avatar?: {
            fs_path: string;
            redirect?: string;
            ext?: string;
        };
    };
    db: {
        host: string;
        port: number;
        username: string;
        password: string;
        synchronize: boolean | string;
    };
    redis: {
        nodes: ClusterNode[];
        options: ClusterOptions;
    };
    bcrypt: {
        cost: number;
        salt: string;
    };
    jwt: {
        expire: string;
        privateKeyPath: string;
        publicKeyPath: string;
    };
    user: {
        default_reputation: number;
    };
    request: {
        expire?: number;
    };
    worker_id?: number;
}

type Keys<T> = keyof T;
type Values<T> = T[Keys<T>];
export type ConfigTemplate<
    T = ConfigOption,
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
    obj = ConfigOption,
> = K extends `${infer L}.${infer R}`
    ? L extends keyof obj
        ? GetTypeByTemplate<R, obj[L]>
        : never
    : K extends keyof obj
    ? obj[K]
    : never;
