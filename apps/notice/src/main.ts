import { NestFactory } from '@nestjs/core';
import { NoticeModule } from './notice.module';

async function bootstrap() {
  const app = await NestFactory.create(NoticeModule);
  await app.listen(3000);
}
bootstrap();
