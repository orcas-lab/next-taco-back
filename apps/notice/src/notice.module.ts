import { Module } from '@nestjs/common';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { RedisModule } from '@app/redis';
import { ConfigModule } from '@app/config';
import { KeypairModule } from '@app/keypair';

@Module({
    imports: [
        RedisModule,
        ConfigModule.forRoot('config.toml'),
        KeypairModule.forRoot(),
    ],
    controllers: [NoticeController],
    providers: [NoticeService],
})
export class NoticeModule {}
