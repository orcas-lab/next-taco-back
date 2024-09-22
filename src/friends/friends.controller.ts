import {
  Body,
  Controller,
  DefaultValuePipe,
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('friends')
@UseGuards(AuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @ApiOperation({
    description: '发送添加好友请求',
  })
  @Post('')
  @ApiResponse({ status: HttpStatus.CREATED, type: AddFriendResponse })
  async sendAddRequest(@Body() data: AddFriend, @User('tid') tid: string) {
    return this.friendsService.sendAddFriendRequest({
      ...data,
      source: tid,
    });
  }

  @ApiOperation({
    description: '删除好友',
  })
  @Delete('')
  async deleteFriend(@Body() data: DeleteFriend, @User('tid') tid: string) {
    return this.friendsService.deleteFriend({ ...data, source: tid });
  }

  @ApiOperation({
    description: '修改好友信息',
  })
  @Patch()
  async updateFriendInfo(@Body() data: UpdateFriend, @User('tid') tid: string) {
    return this.friendsService.updateFriend({ ...data, source: tid });
  }

  @ApiOperation({
    description: '获取好友列表',
  })
  @Get('')
  @ApiResponse({ status: HttpStatus.OK, type: GetFriendListResponse })
  async getFriendList(
    @User('tid') tid: string,
    @Query('limit', new DefaultValuePipe(100)) limit: number,
    @Query('offset', new DefaultValuePipe(0)) offset: number,
  ) {
    if (
      Number.isNaN(limit) ||
      limit === Number.POSITIVE_INFINITY ||
      limit < 0
    ) {
      throw FriendError.LIMIT_IS_NOT_VALIDE;
    }
    if (
      Number.isNaN(offset) ||
      offset === Number.POSITIVE_INFINITY ||
      offset < 0
    ) {
      throw FriendError.OFFSET_IS_NOT_VALIDE;
    }
    return this.friendsService.getFriends(tid, offset);
  }
  @ApiOperation({
    description: '同意添加请求',
  })
  @Post('accept')
  async accept(@Body() data: Accept, @User('tid') tid: string) {
    return this.friendsService.accept(data, tid);
  }

  @ApiOperation({
    description: '拒绝添加请求',
  })
  @Post('reject')
  async reject(@Body() data: Reject, @User('tid') tid: string) {
    return this.friendsService.reject(data, tid);
  }
}
