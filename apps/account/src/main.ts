import { NestFactory } from '@nestjs/core';
import { AccountModule } from './account.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { MicroServiceExceptionFilter } from '@app/common/microservice-exception.filter';
import { MicroserviceErrorTable } from '@app/errors/microservice.error';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AccountModule, {
        transport: Transport.GRPC,
        options: {
            package: 'account',
            protoPath: './proto/account.proto',
            url: 'localhost:5000',
        },
    });
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory(errors) {
                const details = [];
                for (let i = 0; i < errors.length; i++) {
                    const err = errors[i];
                    details.push(...Object.values(err.constraints));
                }
                throw MicroserviceErrorTable.PARAM_INVALIDATE(details);
            },
        }),
    );
    app.useGlobalFilters(new MicroServiceExceptionFilter());
    await app.listen();
}
bootstrap();
