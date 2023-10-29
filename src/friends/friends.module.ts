import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlackList, Friend, Profile, Request } from '@app/entity';
import { ConfigureModule } from '@app/configure';

@Module({
    imports: [
        TypeOrmModule.forFeature([Profile, Request, Friend, BlackList]),
        ConfigureModule.forRoot('config.toml'),
    ],
    controllers: [FriendsController],
    providers: [FriendsService],
})
export class FriendsModule {}
