import { Controller, Get, Inject, Query } from '@nestjs/common';
import { NoticeService } from '../../../notice/src/notice.service';
import providers from '@app/clients-provider';
import { ClientGrpc } from '@nestjs/microservices';
import { Tid } from '@app/common/tid.decorator';

@Controller('notice')
export class NoticeController {
    private readonly noticeService: NoticeService;
    constructor(
        @Inject(providers.NOTICE_SERVICE.name)
        private client: ClientGrpc,
    ) {
        this.noticeService = this.client.getService(NoticeService.name);
    }
    @Get('')
    async getNotices(@Tid() tid: string, @Query('page') page: number) {
        return this.noticeService.listNotice({ tid, page });
    }
}
