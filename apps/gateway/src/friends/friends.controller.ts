import {
    Controller,
    Delete,
    Get,
    Inject,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { FriendsService } from '../../../friends/src/friends.service';
import providers from '@app/clients-provider';
import { ClientGrpc } from '@nestjs/microservices';
import { Tid } from '@app/common/tid.decorator';
import {
    UpdateFriendInfo,
    AcceptFriendRequestData,
    DeleteFriendData,
} from '@app/dto/friends.dto';

@Controller('friends')
export class FriendsController {
    private readonly friendsService: FriendsService;
    constructor(
        @Inject(providers.FRIEND_SERVICE.name) private client: ClientGrpc,
    ) {
        this.friendsService = this.client.getService<FriendsService>(
            FriendsService.name,
        );
    }
    @Delete('')
    async deleteFriend(data: DeleteFriendData) {
        return this.friendsService.deleteFriend(data);
    }
    @Patch('')
    async updateFriend(data: UpdateFriendInfo) {
        return this.friendsService.update(data);
    }
    @Get('')
    async getFrindsList(@Tid() tid: string, @Query('page') page: number) {
        return this.friendsService.getFriendList({ tid, page });
    }
    @Post('accept')
    async acceptRequest(data: AcceptFriendRequestData) {
        return this.friendsService.accept(data);
    }
}
