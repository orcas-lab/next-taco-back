import { Profile } from '@app/interface/profile.interface';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

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
    @ValidateIf((obj) => obj.tid === undefined)
    profile: Omit<Profile, 'tid'>;
}
