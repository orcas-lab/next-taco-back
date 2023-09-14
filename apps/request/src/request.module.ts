import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { ClientsModule } from '@nestjs/microservices';
import providers from '@app/clients-provider';

@Module({
    imports: [
        ClientsModule.register({
            clients: [providers['FRIEND_SERVICE'], providers.NOTICE_SERVICE],
        }),
    ],
    controllers: [RequestController],
    providers: [RequestService],
})
export class RequestModule {}
