import providers from '@app/clients-provider';
import {
    ChangePassword,
    DeleteAccount,
    Login,
    Register,
    TokenPair,
    forgetPassword,
} from '@app/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AccountService as MicroserviceAccountSerivce } from '../../../account/src/account.service';
import { TokenService } from '../../../token/src/token.service';
import { API_ERROR } from '@app/errors/gateway.error';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class AccountService {
    private accountService: MicroserviceAccountSerivce;
    private tokenService: TokenService;
    constructor(
        @Inject(providers.ACCOUNT_SERVICE.name)
        private accountClient: ClientGrpc,
        @Inject(providers.TOKEN_SERVICE.name) private tokenClient: ClientGrpc,
    ) {
        this.accountService =
            this.accountClient.getService<MicroserviceAccountSerivce>(
                MicroserviceAccountSerivce.name,
            );
        this.tokenService = this.tokenClient.getService(TokenService.name);
    }
    async login(data: Login) {
        const isExist = (await this.accountService.accountExists(
            data,
        )) as unknown as Observable<{ value: boolean }>;
        const { value: exists } = await lastValueFrom(isExist);
        console.log(exists);
        if (exists) {
            const tokenPair = (await this.tokenService.sign({
                value: { tid: data.tid },
            })) as unknown as Observable<TokenPair>;
            return lastValueFrom(tokenPair);
        }
        throw API_ERROR.USER_OR_PASSWORD_ERROR;
    }
    async register(data: Register) {
        return this.accountService.register(data);
    }
    async changePassword(tid: string, data: ChangePassword) {
        return this.accountService.changePassword({ tid, ...data });
    }
    async forgetPassword(data: forgetPassword) {
        return this.accountService.changePassword(data);
    }
    async delete(data: DeleteAccount) {
        return this.accountService.deleteAccount(data);
    }
}
