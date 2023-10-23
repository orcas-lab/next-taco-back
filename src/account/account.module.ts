import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@app/entity';
import { ConfigureModule } from '@app/configure';
import { Profile } from '@app/entity/profile.entity';

@Module({
    imports: [
        ConfigureModule.forRoot('config.toml'),
        TypeOrmModule.forFeature([Account, Profile]),
    ],
    controllers: [AccountController],
    providers: [AccountService],
})
export class AccountModule {}
