import { ConfigModule } from '@app/config';
import { ReputationService } from '../src/reputation.service';
import { Account, AccountSchema } from '@app/schema/account.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModule } from '@app/db';
import { Test, TestingModule } from '@nestjs/testing';

describe('ReputationService', () => {
    let reputationService: ReputationService;
    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                DbModule,
                MongooseModule.forFeature([
                    {
                        name: Account.name,
                        collection: Account.name.toLowerCase(),
                        schema: AccountSchema,
                    },
                ]),
                ConfigModule.forRoot('config.toml'),
            ],
            providers: [ReputationService],
        }).compile();

        reputationService = app.get<ReputationService>(ReputationService);
    });
    it('change reputation', () => {
        expect(
            reputationService.changeReputation({ tid: 'test' }),
        ).resolves.toBeTruthy();
    });
});
