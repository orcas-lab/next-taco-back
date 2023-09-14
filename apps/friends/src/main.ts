import { NestFactory } from '@nestjs/core';
import { FriendsModule } from './friends.module';
import providers from 'libs/clients-provider/src';
import {
    MicroServiceExceptionFilter,
    createValidationPipe,
} from '@app/common/microservice-exception.filter';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        FriendsModule,
        providers['FRIEND_SERVICE'],
    );
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new MicroServiceExceptionFilter());
    await app.listen();
}
bootstrap();
