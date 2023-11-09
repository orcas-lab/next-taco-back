import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AuthGuard } from '@app/shared/auth-guard.guard';
import { User } from '../user.decorator';
import { FriendError } from '@app/error';
import {
    Accept,
    AddFriend,
    AddFriendResponse,
    DeleteFriend,
    GetFriendListResponse,
    Reject,
    UpdateFriend,
} from './dto/friend.rquest.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('friends')
@UseGuards(AuthGuard)
@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}
    @Post('')
    @ApiResponse({ status: HttpStatus.CREATED, type: AddFriendResponse })
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
    @ApiResponse({ status: HttpStatus.OK, type: GetFriendListResponse })
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
    async accept(@Body() data: Accept, @User('tid') tid: string) {
        return this.friendsService.accept(data, tid);
    }
    @Post('reject')
    async reject(@Body() data: Reject) {
        return this.friendsService.reject(data);
    }
}
