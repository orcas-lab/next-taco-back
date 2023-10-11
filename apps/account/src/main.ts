import { NestFactory } from '@nestjs/core';
import { AccountModule } from './account.module';
import {
    MicroServiceExceptionFilter,
    createValidationPipe,
} from '@app/common/microservice-exception.filter';
import providers from '@app/clients-provider';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        AccountModule,
        providers.ACCOUNT_SERVICE,
    );
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new MicroServiceExceptionFilter());
    Logger.log(
        `start at ${
            (providers.ACCOUNT_SERVICE.options as { url: string }).url
        }`,
    );
    await app.listen();
}
bootstrap();
