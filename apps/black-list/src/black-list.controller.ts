import { Controller, Get } from '@nestjs/common';
import { BlackListService } from './black-list.service';

@Controller()
export class BlackListController {
  constructor(private readonly blackListService: BlackListService) {}

  @Get()
  getHello(): string {
    return this.blackListService.getHello();
  }
}
