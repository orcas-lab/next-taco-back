import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { ClientsModule } from '@nestjs/microservices';
import providers from '@app/clients-provider';

@Module({
    imports: [
        ClientsModule.register([
            providers.ACCOUNT_SERVICE,
            providers.TOKEN_SERVICE,
        ]),
    ],
    controllers: [AccountController],
    providers: [AccountService],
})
export class AccountModule {}
