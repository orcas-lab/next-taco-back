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
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
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
    @ApiOperation({
        description: '删除指定用户, 但是需要提交该用户的问题答案',
    })
    @Delete('/')
    async delete(@User('tid') tid: string, @Body() data: DeleteAccountRequest) {
        return this.accountService.delete({ ...data, tid });
    }

    @ApiOperation({
        description: '修改当前用户的密码, 会强制该用户下线',
    })
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
