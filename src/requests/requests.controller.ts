import { Controller, Get, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { AuthGuard } from '@app/shared/auth-guard.guard';
import { User } from '../user.decorator';

@UseGuards(AuthGuard)
@Controller('requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}

    @Get()
    findAll(@User('tid') tid: string) {
        return this.requestsService.findAll(tid);
    }
}
