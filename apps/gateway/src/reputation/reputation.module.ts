import { Module } from '@nestjs/common';
import { ReputationController } from './reputation.controller';
import { ClientsModule } from '@nestjs/microservices';
import providers from '@app/clients-provider';

@Module({
    imports: [ClientsModule.register([providers.REPUTATION_SERVICE])],
    controllers: [ReputationController],
})
export class ReputationModule {}
