import { Profile } from '@app/entity/profile.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNotEmptyObject,
    IsObject,
    IsString,
} from 'class-validator';

export class GetUserProfileRequest {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    tid: string;
}
export class UpdateUserProfileRequest {
    @IsObject()
    @IsNotEmptyObject()
    @ApiProperty({ type: Profile })
    profile: Profile;
}
export class BanUser {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    target: string;
}
export class UnBan extends BanUser {}
