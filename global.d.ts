declare type User = {
    tid: string;
};
declare type ErrorResponse = {
    path: string;
    message: string;
    status: number;
};

declare const __TEST__: boolean;

declare namespace NodeJS {
    interface ProcessEnv {
        CI: boolean;
        REDIS_MODE: 'cluster' | 'standalone';
    }
}
