import { HttpStatus } from '@nestjs/common';

enum Modules {
    GLOBAL = 1,
    ACCOUNT,
    Friend,
    Pusher,
}
/**
 * 错误来自于哪
 */
enum ErrorFrom {
    INNER = 1,
    USER,
}

export class ApiError<T = HttpStatus> extends Error {
    public status: T;
    public innerStatus: number;
    public message: string;
    constructor(httpStatus: T, innerStatus: number, message: string) {
        super(message);
        this.status = httpStatus;
        this.innerStatus = innerStatus;
        this.message = message;
    }
}
export class PusherError extends Error {
    public code: number;
    public msg: string;
    public disconnect: boolean;
    constructor(code: number, message: string, disconnect = false) {
        super(message);
        this.code = code;
        this.msg = message;
        this.disconnect = disconnect;
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
    QUESTION_INVALIDE: new ApiError(
        HttpStatus.BAD_REQUEST,
        getCodes(Modules.ACCOUNT, ErrorFrom.USER, 4),
        'QUESTION_INVALIDE',
    ),
};
export const FriendError = {
    IS_FRIEND: new ApiError(
        HttpStatus.BAD_REQUEST,
        getCodes(Modules.Friend, ErrorFrom.USER, 1),
        'IS_FRIEND',
    ),
    LIMIT_IS_NOT_VALIDE: new ApiError(
        HttpStatus.BAD_REQUEST,
        getCodes(Modules.Friend, ErrorFrom.USER, 2),
        'LIMIT_IS_NOT_VALIDE',
    ),
    OFFSET_IS_NOT_VALIDE: new ApiError(
        HttpStatus.BAD_REQUEST,
        getCodes(Modules.Friend, ErrorFrom.USER, 3),
        'OFFSET_IS_NOT_VALIDE',
    ),
    CAN_NOT_FIND_REQ: new ApiError(
        HttpStatus.BAD_REQUEST,
        getCodes(Modules.Friend, ErrorFrom.USER, 4),
        'CAN_NOT_FIND_REQ',
    ),
    REQUEST_EXPIRED: new ApiError(
        HttpStatus.BAD_REQUEST,
        getCodes(Modules.Friend, ErrorFrom.USER, 5),
        'REQUEST_EXPIRED',
    ),
    UNABLE_TO_ACCEPT_OWN_REQUEST: new ApiError(
        HttpStatus.BAD_REQUEST,
        getCodes(Modules.Friend, ErrorFrom.USER, 6),
        'UNABLE_TO_ACCEPT_OWN_REQUEST',
    ),
};
export const PUSHER_ERROR = {
    UNKNOWN_ERROR: new PusherError(
        getCodes(Modules.Pusher, ErrorFrom.INNER, 1),
        'UNKNOWN_ERROR',
        true,
    ),
    INVALIDE_TOKEN: new PusherError(
        getCodes(Modules.Pusher, ErrorFrom.USER, 2),
        'INVALIDE_TOKEN',
        true,
    ),
    IS_NOT_FRIEND: new PusherError(
        getCodes(Modules.Pusher, ErrorFrom.USER, 3),
        'IS_NOT_FRIEND',
    ),
};
