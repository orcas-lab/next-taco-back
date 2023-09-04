import { NestFactory } from '@nestjs/core';
import { RequestModule } from './request.module';

async function bootstrap() {
    const app = await NestFactory.create(RequestModule);
    await app.listen(3000);
}
bootstrap();
