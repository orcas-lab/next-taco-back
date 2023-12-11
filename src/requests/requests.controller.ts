import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { AuthGuard } from '@app/shared/auth-guard.guard';
import { User } from '../user.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { PubReq } from '@app/entity';

@UseGuards(AuthGuard)
@Controller('requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}

    @ApiResponse({ status: HttpStatus.OK, type: [PubReq] })
    @Get()
    findAll(@User('tid') tid: string) {
        return this.requestsService.findAll(tid);
    }
}
