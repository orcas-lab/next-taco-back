import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AddFriend {
    @IsString()
    target: string;
}

export class DeleteFriend {
    @IsString()
    target: string;
    @IsString()
    type: 'single' | 'both';
    @IsBoolean()
    @IsOptional()
    ban?: boolean;
}

export class UpdateFriend {
    @IsString()
    target: string;
    @IsString()
    @IsOptional()
    tag?: string;
    @IsString()
    @IsOptional()
    nick?: string;
}

export class Accept {
    @IsString()
    rid: string;
}

export class Reject {
    @IsString()
    rid: string;
}
