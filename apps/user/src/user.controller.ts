import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { GetProfile, UpdateProfile } from '@app/dto/user.dto';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}
    @GrpcMethod('UserService', 'getProfile')
    getProfile(data: GetProfile) {
        return this.userService.profile(data.tid);
    }
    @GrpcMethod('UserSerivce', 'updateProfile')
    updateProfile(data: UpdateProfile) {
        return this.userService.updateProfile(data);
    }
}
