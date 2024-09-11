import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@app/config';

@Module({
  providers: [DbService],
  exports: [DbService],
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          type: 'postgres',
          host: config.get('db.host'),
          username: config.get('db.username'),
          password: config.get('db.password'),
          database: config.get('db.database') ?? 'taco',
        };
      },
    }),
  ],
})
export class DbModule {}
