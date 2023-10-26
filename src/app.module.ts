import { ConfigureModule, ConfigureService } from '@app/configure';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { omit } from 'ramda';
import { AccountModule } from './account/account.module';
import { JwtModule } from '@app/jwt';
import 'reflect-metadata';
import { ClusterModule } from '@liaoliaots/nestjs-redis';
import { UserModule } from './user/user.module';
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
                    readyLog: true,
                    config: {
                        nodes: configure.get('redis.nodes'),
                        ...configure.get('redis.options'),
                    },
                };
            },
        }),
        JwtModule.use(),
        AccountModule,
        UserModule,
    ],
})
export class AppModule {}
