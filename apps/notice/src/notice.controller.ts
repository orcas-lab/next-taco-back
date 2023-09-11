import { Controller, Get } from '@nestjs/common';
import { NoticeService } from './notice.service';

@Controller()
export class NoticeController {
    constructor(private readonly noticeService: NoticeService) {}
}
