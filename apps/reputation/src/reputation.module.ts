import { Module } from '@nestjs/common';
import { ReputationController } from './reputation.controller';
import { ReputationService } from './reputation.service';
import { DbModule } from '@app/db';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '@app/schema/account.schema';

@Module({
    imports: [
        DbModule,
        MongooseModule.forFeature([
            {
                name: Account.name,
                collection: Account.name.toLowerCase(),
                schema: AccountSchema,
            },
        ]),
    ],
    controllers: [ReputationController],
    providers: [ReputationService],
})
export class ReputationModule {}
