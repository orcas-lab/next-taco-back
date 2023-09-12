import {
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsObject,
    IsString,
} from 'class-validator';

export class ListNoticesRequest {
    @IsString()
    @IsNotEmpty()
    tid: string;
    @IsNumber()
    @IsNotEmpty()
    page: number;
}

export class GetNoticeRequest {
    @IsString()
    @IsNotEmpty()
    nid: string;
}

export class UpdateNoticeRequest {
    @IsString()
    @IsNotEmpty()
    nid: string;
    @IsObject()
    @IsNotEmptyObject()
    notice: Partial<CreateNoticeRequest>;
}

export class DeleteNoticeReuqest {
    @IsString()
    nid: string;
}

export class CreateNoticeRequest {
    @IsString()
    @IsNotEmpty()
    sender: string;
    @IsString()
    @IsNotEmpty()
    reciver: string;
    @IsString()
    @IsNotEmpty()
    group: boolean;
    @IsString()
    @IsNotEmpty()
    message: string;
    @IsString()
    action?: string;
}
