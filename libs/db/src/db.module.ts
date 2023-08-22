import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { MongooseModule } from '@nestjs/mongoose';
import { isDev } from '@app/utils';
import { ConfigModule, ConfigService } from '@app/config';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let mongod: MongoMemoryReplSet;
@Module({
    providers: [DbService],
    exports: [DbService],
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule.forRoot('config.toml')],
            inject: [ConfigService],
            useFactory: async (service: ConfigService) => {
                let uri = service.get<string>('db.uri');
                if (isDev()) {
                    mongod = await MongoMemoryReplSet.create({
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
