import { Module } from '@nestjs/common';
import { PusherService } from './pusher.service';
import { PusherGateway } from './PusherGateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend, Message, Profile } from '@app/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Friend, Profile])],
  providers: [PusherGateway, PusherService],
})
export class PusherModule {}
