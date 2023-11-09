import { Request } from '@app/entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RequestsService {
    constructor(
        @InjectRepository(Request)
        private readonly request: Repository<Request>,
    ) {}
    findAll(tid: string) {
        return this.request.find({
            where: [{ source: tid }, { target: tid }],
        });
    }
}
