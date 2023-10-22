import { ConfigureModule, ConfigureService } from '@app/configure';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { omit } from 'ramda';
import { AccountModule } from './account/account.module';
import { ClusterModule } from '@liaoliaots/nestjs-redis';
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigureModule.forRoot('config.toml')],
            inject: [ConfigureService],
            useFactory(service: ConfigureService) {
                const db = service.get('db');
                return {
                    type: 'mysql',
                    ...omit(['synchronize'], db),
                    synchronize:
                        db['synchronize'] === 'auto'
                            ? Boolean(process.env.__DEV__)
                            : (db['synchronize'] as boolean),
                };
            },
        }),
        ClusterModule.forRootAsync({
            imports: [ConfigureModule.forRoot('config.toml')],
            inject: [ConfigureService],
            async useFactory(configure: ConfigureService) {
                return {
                    config: {
                        nodes: configure.get('redis.nodes'),
                        ...configure.get('redis.options'),
                    },
                };
            },
        }),
        AccountModule,
    ],
})
export class AppModule {}
