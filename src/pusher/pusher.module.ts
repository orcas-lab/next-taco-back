import { Module } from '@nestjs/common';
import { PusherService } from './pusher.service';
import { PusherGateway } from './PusherGateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend, Message, Profile } from '@app/entity';
import { JwtModule } from '@app/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, Friend, Profile]),
        JwtModule.use(),
    ],
    providers: [PusherGateway, PusherService],
})
export class PusherModule {}
