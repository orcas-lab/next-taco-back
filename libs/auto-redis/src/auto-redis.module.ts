import { DynamicModule, Logger, Module } from '@nestjs/common';
import { AutoRedisService } from './auto-redis.service';
import { ClusterModule, RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigureModule, ConfigureService } from '@app/configure';
import { config } from 'dotenv';
config({ path: '.env' });

@Module({
    providers: [AutoRedisService],
    exports: [AutoRedisService],
})
export class AutoRedisModule {
    private static logger = new Logger(AutoRedisModule.name);
    static use(
        path: string,
        cluster = process.env.REDIS_MODE === 'cluster',
        global = true,
    ): DynamicModule {
        this.logger.log(`Redis Mode: ${process.env.REDIS_MODE}`);
        return {
            module: AutoRedisModule,
            providers: [AutoRedisService],
            imports: [
                cluster
                    ? ClusterModule.forRootAsync(
                          {
                              imports: [ConfigureModule.forRoot(path)],
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
                              imports: [ConfigureModule.forRoot(path)],
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
