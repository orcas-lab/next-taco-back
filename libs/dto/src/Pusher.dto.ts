import { IsNotEmpty, IsString } from 'class-validator';

export class Message {
    @IsString()
    @IsNotEmpty()
    sender: string;
    @IsString()
    @IsNotEmpty()
    reciver: string;
    @IsString()
    @IsNotEmpty()
    message: string;
    @IsString()
    pubKey: string;
}
