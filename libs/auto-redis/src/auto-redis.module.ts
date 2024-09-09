import { DynamicModule, Module } from '@nestjs/common';
import { AutoRedisService } from './auto-redis.service';
import { ClusterModule, RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigureService } from '@app/configure';
import { config } from 'dotenv';
import { RedisMemoryServer } from 'redis-memory-server';
config({ path: '.env' });

@Module({
    providers: [AutoRedisService],
    exports: [AutoRedisService],
})
export class AutoRedisModule {
    static use(
        path: string,
        cluster = process.env.REDIS_MODE === 'cluster',
        global = true,
    ): DynamicModule {
        return {
            module: AutoRedisModule,
            providers: [AutoRedisService],
            imports: [
                cluster
                    ? ClusterModule.forRootAsync(
                          {
                              inject: [ConfigureService],
                              useFactory(service: ConfigureService) {
                                  return {
                                      config: {
                                          nodes: service.get('redis.nodes'),
                                      },
                                  };
                              },
                          },
                          true,
                      )
                    : RedisModule.forRootAsync(
                          {
                              inject: [ConfigureService],
                              async useFactory(service: ConfigureService) {
                                  const redis = new RedisMemoryServer();
                                  await redis.start();
                                  if (process.env.CI) {
                                      return {
                                          config: {
                                              host: await redis.getHost(),
                                              port: await redis.getPort(),
                                          },
                                      };
                                  }
                                  return {
                                      config: {
                                          ...service.get('redis.options'),
                                      },
                                  };
                              },
                          },
                          true,
                      ),
            ],
            exports: [cluster ? ClusterModule : RedisModule],
            global: global,
        };
    }
}
