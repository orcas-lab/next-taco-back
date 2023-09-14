import { NestFactory } from '@nestjs/core';
import { BlackListModule } from './black-list.module';
import providers from '@app/clients-provider';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        BlackListModule,
        providers.BLACKLIST_SERVICE,
    );
    await app.listen();
}
bootstrap();
