import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetFriendListData {
    @IsString()
    @IsNotEmpty()
    tid: string;
    @IsNumber({ allowInfinity: false, allowNaN: false })
    page: number;
}
export class FriendRequestAction {
    @IsString()
    @IsNotEmpty()
    source: string;
    @IsString()
    @IsNotEmpty()
    target: string;
}

export class AcceptFriendRequestData extends FriendRequestAction {}
export class RefuseFriendRequestData extends FriendRequestAction {}
export class DeleteFriendData extends FriendRequestAction {
    @IsBoolean()
    black_list?: boolean;
}
