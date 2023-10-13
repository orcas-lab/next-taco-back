import { Controller } from '@nestjs/common';
import { AccountService } from './account.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
    AccountExists,
    AccountOnline,
    ChangePasswordMicroService,
    DeleteAccount,
    KickAccount,
    Register,
} from '@app/dto';

@Controller()
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @GrpcMethod('AccountService', 'register')
    addUser(data: Register) {
        return this.accountService.register(data);
    }
    @GrpcMethod('AccountService', 'changePassword')
    changePassword(data: ChangePasswordMicroService) {
        return this.accountService.changePassword(data);
    }
    @GrpcMethod('AccountService', 'deleteAccount')
    deleteAccount(data: DeleteAccount) {
        return this.accountService.deleteAccount(data);
    }
    @GrpcMethod('AccountService', 'accountExists')
    accountExists(data: AccountExists) {
        return this.accountService.accountExists(data);
    }
    @GrpcMethod('AccountService', 'accountOnline')
    async online(data: AccountOnline) {
        return this.accountService.online(data);
    }
    @GrpcMethod('AccountService', 'kickAccount')
    async kick(data: KickAccount) {
        return this.accountService.kick(data);
    }
}
