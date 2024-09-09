import { Test, TestingModule } from '@nestjs/testing';
import { PusherService } from '../pusher.service';
import { MockRepositoryType, mockRepository } from '@app/mock';
import { Repository } from 'typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import {
    Account,
    BlackList,
    Friend,
    Message,
    Profile,
    Request,
} from '@app/entity';
import { AutoDatabaseModule } from '@app/auto-database';
import { ConfigureModule } from '@app/configure';
import { JwtModule } from '@app/jwt';

describe('PusherService', () => {
    let service: PusherService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.use(),
                ConfigureModule.forRoot('config.toml'),
                TypeOrmModule.forFeature([
                    Account,
                    BlackList,
                    Friend,
                    Message,
                    Profile,
                    Request,
                ]),
                AutoDatabaseModule,
            ],
            providers: [PusherService],
        }).compile();

        service = module.get<PusherService>(PusherService);
    }, 60 * 1000);

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('persistence', () => {
        expect(
            service.persistence({
                source: '',
                target: '',
                msg: '',
            }),
        ).resolves.toBeDefined();
    });
});
