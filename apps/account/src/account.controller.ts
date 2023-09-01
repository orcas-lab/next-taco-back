import { Controller } from '@nestjs/common';
import { AccountService } from './account.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
    AccountExists,
    ChnagePassword,
    DeleteAccount,
    Register,
} from '@app/dto';
import { Login } from '@app/dto';

@Controller()
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @GrpcMethod('AccountService', 'addUser')
    addUser(data: Register) {
        return this.accountService.addUser(data);
    }
    @GrpcMethod('AccountService', 'login')
    login(data: Login) {
        return this.accountService.login(data);
    }
    @GrpcMethod('AccountService', 'change_password')
    changePassword(data: ChnagePassword) {
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
}
