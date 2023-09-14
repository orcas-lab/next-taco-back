import { NestFactory } from '@nestjs/core';
import { RequestModule } from './request.module';
import providers from '@app/clients-provider';
import {
    MicroServiceExceptionFilter,
    createValidationPipe,
} from '@app/common/microservice-exception.filter';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        RequestModule,
        providers.REQUEST_SERVICE,
    );
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new MicroServiceExceptionFilter());
    await app.listen();
}
bootstrap();
