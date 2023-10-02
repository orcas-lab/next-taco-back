import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule } from '@nestjs/microservices';
import providers from '@app/clients-provider';

@Module({
    imports: [ClientsModule.register([providers.USER_SERVICE])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
