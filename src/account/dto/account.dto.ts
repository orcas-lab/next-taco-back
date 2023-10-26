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
    tid: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    password: string;
    @IsNotEmpty()
    @IsNotEmptyObject()
    question: { [x: string]: string | number | boolean };
}

export class LoginRequest {
    @IsNotEmpty()
    @IsString()
    tid: string;
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class DeleteAccountRequest {
    @IsNotEmpty()
    @IsNotEmptyObject()
    question: { [x: string]: string | number | boolean };
}

export class UpdatePasswordRequest {
    @IsNotEmpty()
    @IsString()
    password: string;
    @IsObject()
    question: { [x: string]: string | number | boolean };
}
