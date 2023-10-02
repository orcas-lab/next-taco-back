import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserService as MicroUserService } from '../../../user/src/user.service';
import providers from '@app/clients-provider';
import { GetProfile, UpdateProfile } from '@app/dto/user.dto';
import { isEmpty } from 'ramda';

@Injectable()
export class UserService {
    private userService: MicroUserService;
    constructor(
        @Inject(providers.USER_SERVICE.name) private userClient: ClientGrpc,
    ) {
        this.userService = this.userClient.getService(MicroUserService.name);
    }
    profile(data: GetProfile) {
        return this.userService.profile(data.tid);
    }
    async update(data: UpdateProfile) {
        if (isEmpty(data.profile)) {
            return true;
        }
        return this.userService.updateProfile(data);
    }
}
