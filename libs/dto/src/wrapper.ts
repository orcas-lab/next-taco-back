import { IsObject, IsString } from 'class-validator';

export class WrapperString {
    @IsString()
    value: string;
}

export class WrapperStruct {
    @IsObject()
    value: Record<string, string>;
}
