import { NestFactory } from '@nestjs/core';
import { BlackListModule } from './black-list.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(BlackListModule, {
        transport: Transport.GRPC,
        options: {
            package: 'blackList',
            protoPath: './proto/black-list.proto',
            url: 'localhost:8000',
        },
    });
    await app.listen();
}
bootstrap();
