import { IsNotEmpty, IsString } from 'class-validator';

export class Message {
    @IsString()
    @IsNotEmpty()
    target: string;
    @IsString()
    msg: string;
}
