import { NestFactory } from '@nestjs/core';
import { ReputationModule } from './reputation.module';
import { Transport } from '@nestjs/microservices';
import {
    createValidationPipe,
    MicroServiceExceptionFilter,
} from '@app/common/microservice-exception.filter';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(ReputationModule, {
        transport: Transport.GRPC,
        options: {
            package: 'reputation',
            protoPath: './proto/repulation.proto',
            url: 'localhost:6000',
        },
    });
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new MicroServiceExceptionFilter());
    await app.listen();
}
bootstrap();
