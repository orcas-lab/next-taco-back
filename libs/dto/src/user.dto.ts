import { Profile } from '@app/interface/profile.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetProfile {
    @IsNotEmpty()
    @IsString()
    tid: string;
}

export class UpdateProfile {
    @IsNotEmpty()
    @IsString()
    tid: string;
    @IsNotEmpty()
    profile: Profile;
}
