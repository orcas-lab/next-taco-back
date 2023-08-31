import { NestFactory } from '@nestjs/core';
import { BlackListModule } from './black-list.module';

async function bootstrap() {
  const app = await NestFactory.create(BlackListModule);
  await app.listen(3000);
}
bootstrap();
