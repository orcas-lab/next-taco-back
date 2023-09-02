import {
    IsNotEmpty,
    IsString,
    IsNotEmptyObject,
    IsDateString,
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

export class ChnagePassword {
    @IsNotEmpty()
    @IsString()
    tid: string;
    @IsNotEmpty()
    @IsString()
    new_pass: string;
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
}
