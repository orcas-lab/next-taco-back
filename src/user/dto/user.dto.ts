import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class GetUserProfileRequest {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    tid: string;
}
export class UpdateUserProfileRequest {
    @IsDefined()
    @IsString()
    @ApiProperty()
    nick: string;
    @IsDefined()
    @IsString()
    @ApiProperty()
    description: string;
}
export class BanUser {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    target: string;
}
export class UnBan extends BanUser {}
