import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AuthGuard } from '../auth-guard.guard';
import { User } from '../user.decorator';
import { FriendError } from '@app/error';
import {
    Accept,
    AddFriend,
    DeleteFriend,
    Reject,
    UpdateFriend,
} from './dto/friend.rquest.dto';

@UseGuards(AuthGuard)
@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}
    @Post('')
    async sendAddRequest(@Body() data: AddFriend, @User('tid') tid: string) {
        return this.friendsService.sendAddFriendRequest({
            ...data,
            source: tid,
        });
    }
    @Delete('')
    async deleteFriend(@Body() data: DeleteFriend, @User('tid') tid: string) {
        return this.friendsService.deleteFriend({ ...data, source: tid });
    }
    @Patch()
    async updateFriendInfo(
        @Body() data: UpdateFriend,
        @User('tid') tid: string,
    ) {
        return this.friendsService.updateFriend({ ...data, source: tid });
    }
    @Get('')
    async getFriendList(
        @User('tid') tid: string,
        @Query('limit') limit: string,
        @Query('offset') offset: string,
    ) {
        const numberLimit = Number(limit);
        const numberOffset = Number(offset);
        if (
            Number.isNaN(numberLimit) ||
            numberLimit === Number.POSITIVE_INFINITY ||
            numberLimit < 0
        ) {
            throw FriendError.LIMIT_IS_NOT_VALIDE;
        }
        if (
            Number.isNaN(numberOffset) ||
            numberOffset === Number.POSITIVE_INFINITY ||
            numberOffset < 0
        ) {
            throw FriendError.OFFSET_IS_NOT_VALIDE;
        }
        return this.friendsService.getFriends(tid, numberLimit, numberOffset);
    }
    @Post('accept')
    async accept(@Body() data: Accept) {
        return this.friendsService.accept(data);
    }
    @Post('reject')
    async reject(@Body() data: Reject) {
        return this.friendsService.reject(data);
    }
}