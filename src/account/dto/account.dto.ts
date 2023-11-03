import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsNotEmptyObject,
    IsObject,
} from 'class-validator';
export class RegisterReuqest {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    tid: string;
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password: string;
    @IsNotEmpty()
    @IsNotEmptyObject()
    @ApiProperty()
    question: { [x: string]: string | number | boolean };
}

export class LoginRequest {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    tid: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password: string;
}

export class LoginResponse {
    @ApiProperty()
    access_token: string;
    @ApiProperty()
    refresh_token: string;
}

export class DeleteAccountRequest {
    @IsNotEmpty()
    @IsNotEmptyObject()
    @ApiProperty()
    question: { [x: string]: string | number | boolean };
}

export class UpdatePasswordRequest {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password: string;
    @IsObject()
    @ApiProperty()
    question: { [x: string]: string | number | boolean };
}
