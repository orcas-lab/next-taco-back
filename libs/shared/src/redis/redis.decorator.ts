import { Inject } from '@nestjs/common';
import {
    ClientNamespace,
    DEFAULT_CLUSTER_NAMESPACE,
    DEFAULT_REDIS_NAMESPACE,
    InjectCluster,
    InjectRedis,
    getClusterToken,
    getRedisToken,
} from '@liaoliaots/nestjs-redis';

export const InjectAutoRedis = <T extends boolean = false>(
    cluster?: T,
    namespace?: ClientNamespace,
) => {
    const ns = !namespace
        ? cluster
            ? DEFAULT_CLUSTER_NAMESPACE
            : DEFAULT_REDIS_NAMESPACE
        : namespace;
    if (cluster) {
        const token = getClusterToken(ns);
        return InjectCluster(ns);
    } else {
        const token = getRedisToken(ns);
        return InjectRedis(ns);
    }
};
