import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import {
    MicroServiceExceptionFilter,
    createValidationPipe,
} from '@app/common/microservice-exception.filter';
import providers from '@app/clients-provider';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        UserModule,
        providers.USER_SERVICE,
    );
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new MicroServiceExceptionFilter());
    await app.listen();
}
bootstrap();
