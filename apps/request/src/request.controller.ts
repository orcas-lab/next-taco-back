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

@Controller()
export class RequestController {
    constructor(private readonly requestService: RequestService) {}
    async ListReuqests(data: ListRequestData) {
        return this.requestService.listReuqests(data);
    }
    async AddRequest(data: MicroService_AddRequestData) {
        return this.requestService.add(data);
    }
    async DeleteRequest(data: DeleteRequestData) {
        return this.requestService.delete(data);
    }
    async UpdateRequest(data: UpdateReuqestData) {
        return this.requestService.update(data);
    }
    async AcceptRequest(data: AcceptRequestData) {
        return this.requestService.accept(data);
    }
    async RefuseRequest(data: RefuseRequestData) {
        return this.requestService.refuse(data);
    }
}
