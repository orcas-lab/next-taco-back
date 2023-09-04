import { Controller, Get } from '@nestjs/common';
import { RequestService } from './request.service';

@Controller()
export class RequestController {
    constructor(private readonly requestService: RequestService) {}

    @Get()
    getHello(): string {
        return this.requestService.getHello();
    }
}
