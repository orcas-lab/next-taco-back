import { NestFactory } from '@nestjs/core';
import { FriendsModule } from './friends.module';
import providers from 'libs/clients-provider/src';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(FriendsModule, {
        ...providers['FRIEND_SERVICE'],
    });
    await app.listen();
}
bootstrap();
