import { NestFactory } from '@nestjs/core';
import { TokenModule } from './token.module';
import { Transport } from '@nestjs/microservices';
import {
    MicroServiceExceptionFilter,
    createValidationPipe,
} from '@app/common/microservice-exception.filter';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(TokenModule, {
        transport: Transport.GRPC,
        options: {
            package: 'token',
            protoPath: './proto/token.proto',
            url: 'localhost:7000',
        },
    });
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new MicroServiceExceptionFilter());
    await app.listen();
}
bootstrap();
