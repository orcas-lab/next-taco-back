import { Controller } from '@nestjs/common';
import { BlackListService } from './black-list.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
    AppendToBlackList,
    DeleteBlackList,
    GetBlackList,
} from '@app/dto/black-list.dto';

@Controller()
export class BlackListController {
    constructor(private readonly blackListService: BlackListService) {}

    @GrpcMethod('BlackListService', 'appendToBlackList')
    appendToblackList(data: AppendToBlackList) {
        return this.blackListService.add(data);
    }
    @GrpcMethod('BlackListService', 'deleteBlackList')
    DeleteBlackList(data: DeleteBlackList) {
        return this.blackListService.delete(data);
    }
    @GrpcMethod('BlackListService', 'getBlackList')
    getBlackList(data: GetBlackList) {
        return this.blackListService.query(data);
    }
}
