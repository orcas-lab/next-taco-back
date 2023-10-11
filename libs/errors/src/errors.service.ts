import { status } from '@grpc/grpc-js';
import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

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

export class MicroserviceError {
    public service: string;
    public rpc: string;
    public message: string;
    public status_code: number;
    public detail: string[];
    public code: number;
    constructor(
        status_code: number,
        message: string,
        detail: any[],
        service: string,
        rpc: string,
        rpc_code = status.INVALID_ARGUMENT,
    ) {
        this.rpc = rpc;
        this.status_code = status_code;
        this.detail = detail;
        this.message = message;
        this.service = service;
        this.code = rpc_code;
    }
    throw() {
        return new RpcException({
            code: this.code,
            message: this.message || this.detail[0],
        });
    }
    get json() {
        return JSON.parse(JSON.stringify(this));
    }
}
