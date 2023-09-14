import { NestFactory } from '@nestjs/core';
import { ReputationModule } from './reputation.module';
import {
    createValidationPipe,
    MicroServiceExceptionFilter,
} from '@app/common/microservice-exception.filter';
import providers from '@app/clients-provider';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        ReputationModule,
        providers.REPUTATION_SERVICE,
    );
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new MicroServiceExceptionFilter());
    await app.listen();
}
bootstrap();
