import { Friend } from '@app/entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AddFriend {
    @IsString()
    @ApiProperty()
    target: string;
}

export class AddFriendResponse {
    @ApiProperty()
    rid: string;
}

export class DeleteFriend {
    @IsString()
    @ApiProperty()
    target: string;
    @IsString()
    @ApiProperty()
    type: 'single' | 'both';
    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    ban?: boolean;
}

export class UpdateFriend {
    @IsString()
    @ApiProperty()
    target: string;
    @IsString()
    @IsOptional()
    @ApiProperty()
    tag?: string;
    @IsString()
    @IsOptional()
    @ApiProperty()
    nick?: string;
}

export class Accept {
    @IsString()
    @ApiProperty()
    rid: string;
}

export class Reject {
    @IsString()
    @ApiProperty()
    rid: string;
}

export class GetFriendListResponse {
    @ApiProperty({ type: [Friend] })
    friends: Friend[];
    @ApiProperty()
    total: number;
}
