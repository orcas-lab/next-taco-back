import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import {
    DeleteAccountRequest,
    LoginRequest,
    RegisterReuqest,
    UpdatePasswordRequest,
} from './dto/account.dto';
import { User } from '../user.decorator';
import { AuthGuard } from '../auth-guard.guard';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}
    @Post('/login')
    async login(@Body() data: LoginRequest) {
        return this.accountService.login(data);
    }
    @Post('/register')
    async register(@Body() data: RegisterReuqest) {
        return this.accountService.register(data);
    }
    @Delete('/')
    async delete(@User('tid') tid: string, @Body() data: DeleteAccountRequest) {
        return this.accountService.delete({ ...data, tid });
    }
    @UseGuards(AuthGuard)
    @Patch('/change-password')
    async changePassword(
        @User('tid') tid: string,
        data: UpdatePasswordRequest,
    ) {
        return this.accountService.updatePassword({ ...data, tid });
    }
}
