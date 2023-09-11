import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import {
    RedisModule as Redis,
    RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@app/config';
import { RedisMemoryServer } from 'redis-memory-server';
import { isDev } from '@app/utils';

export const memoryRedis = async () => {
    const server = new RedisMemoryServer({
        instance: {
            ip: '127.0.0.1',
            port: 6379,
        },
    });
    await server.start();
    return server;
};

@Module({
    providers: [RedisService],
    exports: [RedisService],
    imports: [
        Redis.forRootAsync({
            imports: [ConfigModule.forRoot('config.toml')],
            inject: [ConfigService],
            useFactory: async (
                config: ConfigService,
            ): Promise<RedisModuleOptions> => {
                if (isDev()) {
                    const server = await memoryRedis();
                    return {
                        config: {
                            host: await server.getIp(),
                            port: await server.getPort(),
                        },
                    };
                }
                return {
                    readyLog: true,
                    config: {
                        host: config.get<'redis.host'>('redis.host'),
                        port: config.get<'redis.port'>('redis.port'),
                        db: config.get<'redis.db'>('redis.db'),
                        password:
                            config.get<'redis.password'>('redis.password'),
                    },
                };
            },
        }),
    ],
})
export class RedisModule {}
