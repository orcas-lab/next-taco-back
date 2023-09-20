import { Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfile } from '@app/dto/user.dto';
import { Tid } from '@app/common/tid.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('profile')
    getProfile(@Query('tid') tid: string) {
        return this.userService.profile({ tid });
    }
    @Post('profile')
    updateProfile(@Tid() tid: string, profile: UpdateProfile) {
        profile.tid = tid;
        return this.userService.update(profile);
    }
}
