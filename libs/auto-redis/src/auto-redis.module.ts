import { DynamicModule, Module } from '@nestjs/common';
import { AutoRedisService } from './auto-redis.service';
import { ClusterModule, RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigureService } from '@app/configure';
import { config } from 'dotenv';
config({ path: '.env' });

@Module({
    providers: [AutoRedisService],
    exports: [AutoRedisService],
})
export class AutoRedisModule {
    static use(path: string, cluster = true, global = true): DynamicModule {
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
                              useFactory(service: ConfigureService) {
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
