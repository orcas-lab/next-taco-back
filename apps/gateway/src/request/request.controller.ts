import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { RequestService } from '../../../request/src/request.service';
import providers from '@app/clients-provider';
import { ClientGrpc } from '@nestjs/microservices';
import { Tid } from '@app/common/tid.decorator';
import {
    AcceptRequestData,
    Api_AddRequestData,
    RefuseRequestData,
} from '@app/dto/request.dto';
import { API_ERROR } from '@app/errors/gateway.error';

@Controller('request')
export class RequestController {
    private readonly requestService: RequestService;
    constructor(
        @Inject(providers.REQUEST_SERVICE.name)
        private readonly client: ClientGrpc,
    ) {
        this.requestService = this.client.getService(RequestService.name);
    }
    @Get('')
    async getReuqests(@Tid() tid: string, @Query('page') page: number) {
        return this.requestService.listReuqests({ tid, page });
    }
    @Post('')
    async addRequest(@Tid() tid: string, @Body() data: Api_AddRequestData) {
        if (data.reciver === tid) {
            throw API_ERROR.CAN_NOT_TO_SEND_REQUEST_TO_YOURSELF;
        }
        return this.requestService.add({ sender: tid, ...data });
    }
    @Post('aceept')
    async accept(data: AcceptRequestData) {
        return this.requestService.accept(data);
    }
    @Post('refuse')
    async refuse(data: RefuseRequestData) {
        return this.requestService.refuse(data);
    }
}
