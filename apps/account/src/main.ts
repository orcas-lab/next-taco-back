import { NestFactory } from '@nestjs/core';
import { AccountModule } from './account.module';
import { Transport } from '@nestjs/microservices';
import {
    MicroServiceExceptionFilter,
    createValidationPipe,
} from '@app/common/microservice-exception.filter';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AccountModule, {
        transport: Transport.GRPC,
        options: {
            package: 'account',
            protoPath: './proto/account.proto',
            url: 'localhost:5000',
        },
    });
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new MicroServiceExceptionFilter());
    await app.listen();
}
bootstrap();
