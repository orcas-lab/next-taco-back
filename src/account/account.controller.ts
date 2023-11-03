import {
    Body,
    Controller,
    Delete,
    HttpStatus,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import {
    DeleteAccountRequest,
    LoginRequest,
    LoginResponse,
    RegisterReuqest,
    UpdatePasswordRequest,
} from './dto/account.dto';
import { User } from '../user.decorator';
import { AuthGuard } from '@app/shared/auth-guard.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Account } from '@app/entity';

@ApiTags('account')
@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: LoginResponse,
    })
    @Post('/login')
    async login(@Body() data: LoginRequest) {
        return this.accountService.login(data);
    }

    @ApiResponse({
        status: HttpStatus.CREATED,
        type: Account,
    })
    @Post('/register')
    async register(@Body() data: RegisterReuqest) {
        return this.accountService.register(data);
    }
    @Delete('/')
    async delete(@User('tid') tid: string, @Body() data: DeleteAccountRequest) {
        return this.accountService.delete({ ...data, tid });
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Patch('/change-password')
    async changePassword(
        @User('tid') tid: string,
        @Body() data: UpdatePasswordRequest,
    ) {
        return this.accountService.updatePassword({ ...data, tid });
    }
}
