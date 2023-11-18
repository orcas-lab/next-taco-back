import {
    ClientNamespace,
    DEFAULT_CLUSTER_NAMESPACE,
    DEFAULT_REDIS_NAMESPACE,
    InjectCluster,
    InjectRedis,
} from '@liaoliaots/nestjs-redis';
import { config } from 'dotenv';
config({ path: '.env' });

export type Mode = 'cluster' | 'single';

export const InjectAutoRedis = <T extends Mode = 'cluster'>(
    mode: T = process.env.REDIS_MODE as T,
    namespace?: ClientNamespace,
) => {
    const cluster = mode === 'cluster';
    const ns = !namespace
        ? cluster
            ? DEFAULT_CLUSTER_NAMESPACE
            : DEFAULT_REDIS_NAMESPACE
        : namespace;
    if (cluster) {
        return InjectCluster(ns);
    }
    return InjectRedis(ns);
};
