import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ErrorFilter } from '@app/error/error.filter';
import { IoAdapter } from '@nestjs/platform-socket.io';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.useWebSocketAdapter(new IoAdapter(app));
    // app.useGlobalPipes(new ValidationPipe());
    // app.useGlobalFilters(new ErrorFilter());
    app.enableCors({ origin: '*' });
    await app.listen(3000);
}

bootstrap();
