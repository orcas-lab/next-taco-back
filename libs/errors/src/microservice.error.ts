import { MicroserviceError } from './errors.service';
/**
 * - <等级>  1位 1为系统错误2为用户错误
 * - <责任方> 2位
 * - <自定义> 4位
 */
export const MicroserviceErrorTable = {
    // 宏观错误码
    UNKNOWN_ERROR: new MicroserviceError(
        10000001,
        'UNKNOWN_ERROR',
        [],
        'GLOBAL',
        '',
    ),
    SIGN_FAIL: new MicroserviceError(
        1000002,
        'SIGN_PARAM_ERROR',
        [],
        'GLOBAL',
        '',
    ),
    TOKEN_EXPIRED: new MicroserviceError(
        1000003,
        'TOKEN_EXPIRED',
        [],
        'GLOBAL',
        '',
    ),
    TOKEN_INVALIDATE: new MicroserviceError(
        10000004,
        'TOKEN_INVALIDATE',
        [],
        'GLOBAL',
        '',
    ),
    PARAM_INVALIDATE: (details: string[]) =>
        new MicroserviceError(
            10000005,
            'PARAM_INVALIDATE',
            details,
            'GLOBAL',
            '',
        ),
    // 账号服务
    TID_EXISTS: new MicroserviceError(
        2010001,
        'TID_EXISTS',
        [],
        'ACCOUNT',
        'REG',
    ),
    USER_OR_PASSWORD_ERROR: new MicroserviceError(
        2010002,
        'TID_OR_PASSWORD_ERROR',
        [],
        'ACCOUNT',
        'LOGIN',
    ),
    ACCOUNT_NOT_EXISTS: new MicroserviceError(
        2010003,
        'ACCOUNT_NOT_EXISTS',
        [],
        'ACCOUNT',
        'LOGIN',
    ),
    ACCEPT_ADD_FRIEND_REQUEST_FAIL: new MicroserviceError(
        2020001,
        'ACCEPT_ADD_FRIEND_REQUEST_FAIL',
        [],
        'FRIEND',
        'ACCEPT',
    ),
};
