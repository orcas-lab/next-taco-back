export interface ConfigOption {
    cluster: {
        enable: boolean;
    };
    redis: {
        host: string;
        port: number;
        db: number;
        password: string;
    };
    db: {
        uri: string;
    };
    account: {
        reputation: {
            default: number;
        };
    };
    reputation: {
        // 最小信誉分
        min: number;
        // 减少的步数 0.1则是每接收一个举报则 -0.1
        step: number;
        // 一个范围 [start,end?]
        limit: {
            // 禁止登陆
            ban: [number, number?];
            // 禁止发言(全局)
            muted: [number, number?];
            // 禁止发送申请(任何)
            request: [number, number?];
        };
    };
    key: {
        path: {
            pub: string;
            pri: string;
        };
        type: string;
        passphrase: string;
        userIDs?: {
            name: string;
            comment: string;
            email: string;
        };
        access_token: {
            expire: string;
        };
        refresh_token: {
            expire: string;
        };
    };
    blackList: {
        size: number;
    };
    requests: {
        size: number;
    };
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
