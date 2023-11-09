import { Request } from '@app/entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class RequestsService {
    constructor(
        @InjectRepository(Request)
        private readonly request: Repository<Request>,
    ) {}
    findAll(tid: string) {
        return this.request.find({
            where: { target: tid, expire_at: MoreThan(new Date().getTime()) },
            select: [
                'create_at',
                'expire_at',
                'update_at',
                'source',
                'target',
                'uuid',
            ],
        });
    }
}
