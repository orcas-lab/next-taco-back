import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from '../src/request.service';
import { KeypairModule } from '@app/keypair';
import { DbModule } from '@app/db';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestSchema, Requests } from '@app/schema/requests.schema';

describe('RequestService', () => {
    let service: RequestService;
    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                KeypairModule.forRoot(),
                DbModule,
                MongooseModule.forFeature([
                    {
                        name: Requests.name,
                        collection: Requests.name.toLowerCase(),
                        schema: RequestSchema,
                    },
                ]),
            ],
            providers: [RequestService],
        }).compile();
        service = app.get<RequestService>(RequestService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('add request', () => {
        return expect(
            service.add({
                sender: 'test-1',
                reciver: 'test',
                cmd: 'FRIEND:ADD:SENDER',
                meta: {},
            }),
        ).resolves.toBeTruthy();
    });
    describe('list requests', () => {
        it('success', async () => {
            await service.add({
                sender: 'test-1',
                reciver: 'test',
                cmd: 'FRIEND:ADD:SENDER',
                meta: {},
            });
            expect(
                service.listReuqests({ tid: 'test', page: 1 }),
            ).resolves.not.toThrow();
        });
    });
});
