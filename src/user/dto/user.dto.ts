import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserProfileRequest {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    tid: string;
}
export class UpdateUserProfileRequest {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    nick: string;
    @IsNotEmpty()
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
