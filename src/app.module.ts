import { ConfigureModule, ConfigureService } from '@app/configure';
import { Logger, Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { JwtModule } from '@app/jwt';
import 'reflect-metadata';
import { UserModule } from './user/user.module';
import { FriendsModule } from './friends/friends.module';
import { PusherModule } from './pusher/pusher.module';
import { RequestsModule } from './requests/requests.module';
import { AutoRedisModule } from '@app/auto-redis';
import { RMQModule } from 'nestjs-rmq';
import { join, resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { AutoDatabaseModule } from '@app/auto-database';

@Module({
    imports: [
        ConfigureModule.forRoot('config.toml'),
        RMQModule.forRootAsync({
            inject: [ConfigureService],
            useFactory(service: ConfigureService) {
                return {
                    exchangeName: service.get('mq.exchangeName'),
                    connections: [
                        {
                            login: service.get('mq.connections.login'),
                            password: service.get('mq.connections.password'),
                            host: service.get('mq.connections.host'),
                        },
                    ],
                };
            },
        }),
        AutoDatabaseModule,
        AutoRedisModule.use('config.toml'),
        JwtModule.use(),
        AccountModule,
        UserModule,
        FriendsModule,
        PusherModule,
        RequestsModule,
    ],
})
export class AppModule {
    onModuleInit() {
        const root = resolve(__dirname);
        const dataRoot = join(root, 'data');
        if (existsSync(dataRoot)) {
            Logger.warn(
                'dist/data exists, if you want restart server please remove',
            );
            return;
        } else {
            mkdirSync(dataRoot, { recursive: true });
        }
        writeFileSync(join(dataRoot, 'lock.file'), '');
    }
}
