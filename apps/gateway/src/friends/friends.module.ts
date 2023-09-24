import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { ClientsModule } from '@nestjs/microservices';
import providers from '@app/clients-provider';

@Module({
    imports: [ClientsModule.register([providers.FRIEND_SERVICE])],
    controllers: [FriendsController],
    providers: [FriendsService],
})
export class FriendsModule {}
