import { Module } from '@nestjs/common';
import { NoticeController } from './notice.controller';
import { ClientsModule } from '@nestjs/microservices';
import providers from '@app/clients-provider';

@Module({
    imports: [ClientsModule.register([providers.NOTICE_SERVICE])],
    controllers: [NoticeController],
})
export class NoticeModule {}
