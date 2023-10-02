import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
    const app = await NestFactory.create(GatewayModule);
    app.setGlobalPrefix('/api/v1/');
    await app.listen(process.env.GATEWAY_PORT ?? 4000);
}
bootstrap();
