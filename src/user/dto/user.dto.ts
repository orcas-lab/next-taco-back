import { Profile } from '@app/entity/profile.entity';
import {
    IsNotEmpty,
    IsNotEmptyObject,
    IsObject,
    IsString,
} from 'class-validator';

export class GetUserProfileRequest {
    @IsNotEmpty()
    @IsString()
    tid: string;
}
export class UpdateUserProfileRequest {
    @IsObject()
    @IsNotEmptyObject()
    profile: Profile;
}
export class BanUser {
    @IsNotEmpty()
    @IsString()
    target: string;
}
export class UnBan extends BanUser {}
