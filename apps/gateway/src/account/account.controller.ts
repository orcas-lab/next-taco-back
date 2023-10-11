import { ChangePassword, Login, Register, forgetPassword } from '@app/dto';
import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { AccountService } from './account.service';
import { Tid } from '@app/common/tid.decorator';

@Controller('account')
export class AccountController {
    constructor(private service: AccountService) {}
    @Post('login')
    async login(@Body() data: Login) {
        return this.service.login(data);
    }
    @Post('register')
    async register(@Body() data: Register) {
        return this.service.register(data);
    }
    @Put('change-password')
    async changePassword(@Tid() tid: string, @Body() data: ChangePassword) {
        return this.service.changePassword(tid, data);
    }
    @Put('forget-password')
    async forgetPassword(data: forgetPassword) {
        return this.service.forgetPassword(data);
    }
    @Delete('')
    async DeleteAccount(@Tid() tid: string) {
        return this.service.delete({ tid });
    }
}