import { Controller } from '@nestjs/common';
import { RequestService } from './request.service';
import {
    AcceptRequestData,
    DeleteRequestData,
    ListRequestData,
    MicroService_AddRequestData,
    RefuseRequestData,
    UpdateReuqestData,
} from '@app/dto/request.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class RequestController {
    constructor(private readonly requestService: RequestService) {}
    @GrpcMethod('RequestService', 'ListReuqests')
    async ListReuqests(data: ListRequestData) {
        return this.requestService.listReuqests(data);
    }
    @GrpcMethod('RequestService', 'AddRequest')
    async AddRequest(data: MicroService_AddRequestData) {
        return this.requestService.add(data);
    }
    @GrpcMethod('RequestService', 'DeleteRequest')
    async DeleteRequest(data: DeleteRequestData) {
        return this.requestService.delete(data);
    }
    @GrpcMethod('RequestService', 'UpdateRequest')
    async UpdateRequest(data: UpdateReuqestData) {
        return this.requestService.update(data);
    }
    @GrpcMethod('RequestService', 'AcceptRequest')
    async AcceptRequest(data: AcceptRequestData) {
        return this.requestService.accept(data);
    }
    @GrpcMethod('RequestService', 'RefuseRequest')
    async RefuseRequest(data: RefuseRequestData) {
        return this.requestService.refuse(data);
    }
}
