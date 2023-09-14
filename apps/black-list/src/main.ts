import { NestFactory } from '@nestjs/core';
import { BlackListModule } from './black-list.module';
import providers from '@app/clients-provider';
import {
    MicroServiceExceptionFilter,
    createValidationPipe,
} from '@app/common/microservice-exception.filter';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        BlackListModule,
        providers.BLACKLIST_SERVICE,
    );
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new MicroServiceExceptionFilter());
    await app.listen();
}
bootstrap();
