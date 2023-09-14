import { NestFactory } from '@nestjs/core';
import { RequestModule } from './request.module';
import providers from '@app/clients-provider';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        RequestModule,
        providers.REQUEST_SERVICE,
    );
    await app.listen();
}
bootstrap();
