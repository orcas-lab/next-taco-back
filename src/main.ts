import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@app/shared/http-exception.filter';
import { WsExceptionFilter } from '@app/shared/ws-exception-filter/ws-exception-filter.filter';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    const conf = new DocumentBuilder()
        .setTitle('Taco')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new WsExceptionFilter());
    app.useGlobalFilters(new HttpExceptionFilter());
    const document = SwaggerModule.createDocument(app, conf);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}

bootstrap();
