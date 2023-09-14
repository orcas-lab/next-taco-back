import { NestFactory } from '@nestjs/core';
import { NoticeModule } from './notice.module';
import providers from '@app/clients-provider';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        NoticeModule,
        providers.NOTICE_SERVICE,
    );
    await app.listen();
}
bootstrap();
