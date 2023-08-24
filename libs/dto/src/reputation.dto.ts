import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ChangeReputation {
    @IsString()
    @IsNotEmpty()
    tid: string;
    @IsBoolean()
    up?: boolean;
}
