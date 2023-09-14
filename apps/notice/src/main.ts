import { NestFactory } from '@nestjs/core';
import { NoticeModule } from './notice.module';
import providers from '@app/clients-provider';
import {
    MicroServiceExceptionFilter,
    createValidationPipe,
} from '@app/common/microservice-exception.filter';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        NoticeModule,
        providers.NOTICE_SERVICE,
    );
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new MicroServiceExceptionFilter());
    await app.listen();
}
bootstrap();
