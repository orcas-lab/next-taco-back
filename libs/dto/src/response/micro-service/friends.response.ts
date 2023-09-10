import { Friend } from '@app/interface/friends.interface';

export interface GetFriendListResponse {
    friends: Friend[];
    page: number;
    total: number;
}
