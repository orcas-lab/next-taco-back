import { Requests } from '@app/schema/requests.schema';
import {
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsObject,
    IsString,
} from 'class-validator';

export class ListRequestData {
    @IsString()
    @IsNotEmpty()
    tid: string;
    @IsNumber({ allowInfinity: false, allowNaN: false })
    page: number;
}

export class GetRequestData {
    @IsString()
    @IsNotEmpty()
    rid: string;
}

export class Api_AddRequestData {
    @IsNotEmpty()
    @IsString()
    reciver: string;
    @IsObject()
    @IsNotEmptyObject()
    meta: Record<string, string>;
    @IsString()
    @IsNotEmpty()
    cmd: string;
}
export class MicroService_AddRequestData extends Api_AddRequestData {
    @IsString()
    @IsNotEmpty()
    sender: string;
}
export class DeleteRequestData {
    @IsString()
    @IsNotEmpty()
    rid: string;
}

export class UpdateReuqestData {
    @IsString()
    @IsNotEmpty()
    rid: string;
    @IsNotEmptyObject()
    @IsObject()
    req: Requests;
}

export class AcceptRequestData {
    @IsString()
    @IsNotEmpty()
    rid: string;
}

export class RefuseRequestData {
    @IsString()
    @IsNotEmpty()
    rid: string;
}
