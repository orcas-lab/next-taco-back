import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { Transport } from '@nestjs/microservices';
import {
    MicroServiceExceptionFilter,
    createValidationPipe,
} from '@app/common/microservice-exception.filter';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(UserModule, {
        transport: Transport.GRPC,
        options: {
            package: 'user',
            protoPath: './proto/user.proto',
            url: 'localhost:7000',
        },
    });
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new MicroServiceExceptionFilter());
    await app.listen();
}
bootstrap();
