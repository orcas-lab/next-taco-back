import { HttpExceptionFilter } from '@app/shared/http-exception.filter';
import { WsExceptionFilter } from '@app/shared/ws-exception-filter/ws-exception-filter.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { Account } from '@app/entity/account.entity';
import { Profile } from '@app/entity/profile.entity';
import { BlackList } from '@app/entity/black-list.entity';
import { Friend, Message, Request } from '@app/entity';

export const clearDatabase = async (app: INestApplication<any>) => {
  const dataSource = app.get(DataSource);
  await dataSource.createQueryBuilder().delete().from(Friend).execute();
  await dataSource.createQueryBuilder().delete().from(Request).execute();
  await dataSource.createQueryBuilder().delete().from(Message).execute();
  await dataSource.createQueryBuilder().delete().from(Account).execute();
  await dataSource.createQueryBuilder().delete().from(Profile).execute();
  await dataSource.createQueryBuilder().delete().from(BlackList).execute();
};

export const initTest = async () => {
  let db: DataSource;
  const drop = async () => {
    db = await new DataSource({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'taco',
    }).initialize();
    await db.dropDatabase();
  };
  await drop();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new WsExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3000);
  return { app, db };
};
