import { Module } from '@nestjs/common';
import { AutoDatabaseService } from './auto-database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigureService } from '@app/configure';
import { omit } from 'ramda';

@Module({
  providers: [AutoDatabaseService],
  exports: [AutoDatabaseService],
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigureService],
      async useFactory(config: ConfigureService) {
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
