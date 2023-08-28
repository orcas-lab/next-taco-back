import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BanUser {
    @IsNotEmpty()
    @IsString()
    tid: string;
    @IsNotEmpty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    expire: number;
    @IsNotEmpty()
    @IsString()
    reason: string;
}
