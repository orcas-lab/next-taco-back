import { Module } from '@nestjs/common';
import { PusherService } from './pusher.service';
import { PusherGateway } from './PusherGateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend, Message, Profile } from '@app/entity';
import { JwtModule } from '@app/jwt';
import { KeysModule } from '@app/keys';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Friend, Profile]),
    JwtModule.use(),
    KeysModule.use(false),
  ],
  providers: [PusherGateway, PusherService],
})
export class PusherModule {}
