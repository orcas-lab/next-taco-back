import { HttpStatus } from '@nestjs/common';

enum Modules {
    GLOBAL = 1,
    ACCOUNT,
}
/**
 * 错误来自于哪
 */
enum ErrorFrom {
    INNER = 1,
    USER,
}

export class ApiError extends Error {
    public status: HttpStatus;
    public innerStatus: number;
    public message: string;
    constructor(httpStatus: HttpStatus, innerStatus: number, message: string) {
        super(message);
        this.status = httpStatus;
        this.innerStatus = innerStatus;
        this.message = message;
    }
}
const getCodes = (module: Modules, ErrorFrom: ErrorFrom, step: number) => {
    return 1000 * module + 100 * ErrorFrom + step;
};
export const AccountError = {
    ACCOUNT_NOT_EXISTS: new ApiError(
        HttpStatus.BAD_REQUEST,
        getCodes(Modules.ACCOUNT, ErrorFrom.USER, 1),
        'ACCOUNT_NOT_EXISTS',
    ),
    ACCOUNT_EXISTS: new ApiError(
        HttpStatus.BAD_REQUEST,
        getCodes(Modules.ACCOUNT, ErrorFrom.USER, 2),
        'ACCOUNT_EXISTS',
    ),
    TID_OR_PASSWORD_ERROR: new ApiError(
        HttpStatus.BAD_REQUEST,
        getCodes(Modules.ACCOUNT, ErrorFrom.USER, 3),
        'TID_OR_PASSWORD_ERROR',
    ),
};

export const GlobalError = {
    UNKNOWN: new ApiError(
        HttpStatus.BAD_REQUEST,
        getCodes(Modules.GLOBAL, ErrorFrom.INNER, 1),
        'ACCOUNT_NOT_EXISTS',
    ),
};
