import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { ClientsModule } from '@nestjs/microservices';
import providers from '@app/clients-provider';

@Module({
    imports: [ClientsModule.register([providers.REQUEST_SERVICE])],
    controllers: [RequestController],
    providers: [RequestService],
})
export class RequestModule {}
