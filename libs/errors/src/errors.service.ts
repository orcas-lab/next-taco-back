import { HttpStatus } from '@nestjs/common';

export class BaseError extends Error {
    public code: number;
    public message: string;
    public detail: any[];
    constructor(code: number, message: string, detail: any[]) {
        super(message);
        this.code = code;
        this.message = message;
        this.detail = detail;
    }
}

export class ApiError extends BaseError {
    public status = HttpStatus.BAD_REQUEST;
    constructor(
        code: number,
        message: string,
        detail: any[],
        module: string,
        service: string,
        status: HttpStatus = HttpStatus.BAD_REQUEST,
    ) {
        super(code, message, detail);
        this.status = status;
    }
}

export class MicroserviceError extends BaseError {
    public service: string;
    public rpc: string;
    constructor(
        code: number,
        message: string,
        detail: any[],
        service: string,
        rpc: string,
    ) {
        super(code, message, detail);
        this.service = service;
        this.rpc = rpc;
    }
    get json() {
        return JSON.parse(JSON.stringify(this));
    }
}
