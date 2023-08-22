import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import {
    RedisModule as Redis,
    RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@app/config';
import { RedisMemoryServer } from 'redis-memory-server';
import { isDev } from '@app/utils';

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
                    const server = new RedisMemoryServer({
                        instance: {
                            ip: '127.0.0.1',
                            port: 6379,
                        },
                    });
                    await server.start();
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
                        host: config.get<string>('redis.host'),
                        port: config.get<number>('redis.port'),
                        db: config.get<number>('redis.db'),
                        password: config.get<string>('redis.password'),
                    },
                };
            },
        }),
    ],
})
export class RedisModule {}
