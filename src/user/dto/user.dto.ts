import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetUserProfileRequest {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    tid: string;
}
export class UpdateUserProfileRequest {
    @IsOptional()
    @IsString()
    @ApiProperty()
    nick: string;
    @IsOptional()
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
