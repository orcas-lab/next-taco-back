import { Module } from '@nestjs/common';
import { AutoDatabaseService } from './auto-database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigureService } from '@app/configure';
import { createDB } from 'mysql-memory-server';
import { omit } from 'ramda';

@Module({
    providers: [AutoDatabaseService],
    exports: [AutoDatabaseService],
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigureService],
            async useFactory(config: ConfigureService) {
                if (process.env.CI) {
                    const db = await createDB({
                        dbName: 'test',
                        version: '8.4.2',
                        deleteDBAfterStopped: true,
                    });
                    return {
                        type: 'mysql',
                        synchronize: true,
                        autoLoadEntities: true,
                        host: 'localhost',
                        username: db.username,
                        database: db.dbName,
                        port: db.port,
                        password: '',
                    };
                }
                return {
                    type: 'mysql',
                    ...omit(['synchronize'], config.get('db')),
                    synchronize:
                        config.get('db.synchronize') === 'auto'
                            ? process.env.NODE_ENV === 'development'
                            : (config.get('db.synchronize') as boolean),
                };
            },
        }),
    ],
})
export class AutoDatabaseModule {}
