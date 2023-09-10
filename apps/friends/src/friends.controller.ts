import { Controller } from '@nestjs/common';
import { FriendsService } from './friends.service';
import {
    AcceptFriendRequestData,
    GetFriendListData,
    UpdateFriendInfo,
} from '@app/dto/friends.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}
    @GrpcMethod('FriendsService', 'getFriendList')
    async getFriendList(data: GetFriendListData) {
        return this.friendsService.getFriendList(data);
    }
    @GrpcMethod('FriendsService', 'accept')
    async accept(data: AcceptFriendRequestData) {
        return this.friendsService.accept(data);
    }
    @GrpcMethod('FriendsService', 'refuse')
    async refuse() {
        return this.friendsService.refuse();
    }
    @GrpcMethod('FriendsService', 'update')
    async update(data: UpdateFriendInfo) {
        return this.friendsService.update(data);
    }
}
