import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@app/config';

@Module({
    providers: [DbService],
    exports: [DbService],
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule.forRoot('config.toml')],
            inject: [ConfigService],
            useFactory: async (service: ConfigService) => {
                let uri = service.get<'db.uri'>('db.uri');
                if (__DEV__) {
                    const { MongoMemoryReplSet } = await import(
                        'mongodb-memory-server'
                    );
                    const mongod = await MongoMemoryReplSet.create({
                        replSet: {
                            count: 2,
                        },
                    });
                    uri = mongod.getUri();
                }
                return {
                    uri,
                };
            },
        }),
    ],
})
export class DbModule {}
