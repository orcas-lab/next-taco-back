import { Module } from '@nestjs/common';
import { PusherService } from './pusher.service';
import { PusherGateway } from './pusher.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend, Message } from '@app/entity';

@Module({
    imports: [TypeOrmModule.forFeature([Message, Friend])],
    providers: [PusherGateway, PusherService],
})
export class PusherModule {}
