import { HttpExceptionFilter } from '@app/shared/http-exception.filter';
import { WsExceptionFilter } from '@app/shared/ws-exception-filter/ws-exception-filter.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';

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
