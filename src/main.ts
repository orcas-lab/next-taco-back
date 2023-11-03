import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ErrorFilter } from '@app/error/error.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const conf = new DocumentBuilder()
        .setTitle('Taco')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ErrorFilter());
    app.enableCors({ origin: '*' });
    const document = SwaggerModule.createDocument(app, conf);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}

bootstrap();
