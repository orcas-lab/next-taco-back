import { ConfigureModule, ConfigureService } from '@app/configure';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { omit } from 'ramda';
import { AccountModule } from './account/account.module';
import { JwtModule } from '@app/jwt';
import 'reflect-metadata';
import { UserModule } from './user/user.module';
import { FriendsModule } from './friends/friends.module';
import { PusherModule } from './pusher/pusher.module';
import { RequestsModule } from './requests/requests.module';
import { AutoRedisModule } from '@app/auto-redis';
import { IRMQServiceOptions, RMQModule } from 'nestjs-rmq';

@Module({
    imports: [
        ConfigureModule.forRoot('config.toml'),
        RMQModule.forRootAsync({
            imports: [ConfigureModule.forRoot('config.toml')],
            inject: [ConfigureService],
            useFactory(service: ConfigureService) {
                return {
                    ...service.get('mq'),
                } as IRMQServiceOptions;
            },
        }),
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
        AutoRedisModule.use('config.toml'),
        JwtModule.use(),
        AccountModule,
        UserModule,
        FriendsModule,
        PusherModule,
        RequestsModule,
    ],
})
export class AppModule {}
