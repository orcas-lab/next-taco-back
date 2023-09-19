import {
    IsNotEmpty,
    IsString,
    IsNotEmptyObject,
    IsDateString,
    IsObject,
} from 'class-validator';
export class Register {
    @IsNotEmpty()
    @IsString()
    tid: string;
    @IsNotEmpty()
    @IsString()
    nick: string;
    @IsNotEmpty()
    @IsString()
    password: string;
    @IsString()
    email: string;
    @IsNotEmpty()
    @IsString()
    sex: string;
    @IsNotEmptyObject()
    question: {
        [x: string]: string;
    };
    @IsNotEmpty()
    @IsString()
    @IsDateString({ strict: true })
    birthday: string;
}

export class Login {
    @IsNotEmpty()
    @IsString()
    tid: string;
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class ChangePasswordMicroService {
    @IsNotEmpty()
    @IsString()
    tid: string;
    @IsNotEmpty()
    @IsString()
    new_pass: string;
    @IsObject()
    question: {
        [x: string]: string;
    };
}

export class ChangePassword {
    @IsNotEmpty()
    @IsString()
    new_pass: string;
    @IsObject()
    question: {
        [x: string]: string;
    };
}

export class DeleteAccount {
    @IsNotEmpty()
    @IsString()
    tid: string;
}
export class AccountExists {
    @IsNotEmpty()
    @IsString()
    tid: string;
    @IsString()
    password?: string;
}

export class AccountOnline {
    @IsString()
    @IsNotEmpty()
    tid: string;
}

export class KickAccount {
    @IsString()
    @IsNotEmpty()
    tid: string;
}
