import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AppendToBlackList {
    @IsNotEmpty()
    source: string;
    @IsNotEmpty()
    target: string;
}

export class DeleteBlackList {
    @IsNotEmpty()
    source: string;
    @IsNotEmpty()
    target: string;
}

export class GetBlackList {
    @IsNotEmpty()
    source: string;
    @IsOptional()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    page: number;
}
