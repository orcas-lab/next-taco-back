import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '@app/entity/profile.entity';
import { BlackList } from '@app/entity/black-list.entity';
import { Account } from '@app/entity';

@Module({
    imports: [TypeOrmModule.forFeature([Account, Profile, BlackList])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
