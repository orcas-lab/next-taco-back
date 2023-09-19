import { HttpStatus } from '@nestjs/common';
import { ApiError } from './errors.service';

/**
 * - <等级>  1位 1为系统错误2为用户错误
 * - <责任方> 2位 全局通用就是00
 * - <自定义> 4位
 */
export const API_ERROR = {
    UNKNOWN_ERROR: new ApiError(
        1000001,
        'UNKNOWN_ERROR',
        [],
        'GLOBAL',
        '',
        HttpStatus.SERVICE_UNAVAILABLE,
    ),
    PARAM_INVALIDATE: (details: string[]) =>
        new ApiError(
            10000002,
            'PARAM_INVALIDATE',
            details,
            'GLOBAL',
            '',
            HttpStatus.BAD_REQUEST,
        ),
    TID_EXISTS: new ApiError(
        2010001,
        'TID_EXISTS',
        [],
        'ACCOUNT',
        'LOGIN',
        HttpStatus.BAD_REQUEST,
    ),
    USER_OR_PASSWORD_ERROR: new ApiError(
        2010002,
        'TID_OR_PASSWORD_ERROR',
        [],
        'ACCOUNT',
        'LOGIN',
        HttpStatus.BAD_REQUEST,
    ),
};
