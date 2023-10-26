import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../user.decorator';
import { AuthGuard } from '../auth-guard.guard';
import { BanUser, UnBan, UpdateUserProfileRequest } from './dto/user.dto';
import { TargetExistsGuard } from '../target-exists.guard';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('profile')
    getProfile(@Query('tid') tid: string) {
        return this.userService.getProfile({ tid });
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard)
    @Patch('profile')
    updateProfile(
        @User('tid') tid: string,
        @Body() data: UpdateUserProfileRequest,
    ) {
        return this.userService.updateProfile({ tid, ...data });
    }

    @UseGuards(AuthGuard, TargetExistsGuard)
    @Post('ban')
    banUser(@User('tid') tid: string, @Body() data: BanUser) {
        return this.userService.banUser({
            ...data,
            source: tid,
        });
    }

    @UseGuards(AuthGuard, TargetExistsGuard)
    @Delete('ban')
    unbanUser(@User('tid') tid: string, @Body() data: UnBan) {
        return this.userService.unban({ ...data, source: tid });
    }
}
