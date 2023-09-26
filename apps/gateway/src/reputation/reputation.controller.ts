import { Body, Controller, Inject, Patch } from '@nestjs/common';
import { ReputationService } from '../../../reputation/src/reputation.service';
import providers from '@app/clients-provider';
import { ClientGrpc } from '@nestjs/microservices';
import { Tid } from '@app/common/tid.decorator';
import { ChangeReputation } from '@app/dto';
import { API_ERROR } from '@app/errors/gateway.error';

@Controller('reputation')
export class ReputationController {
    private readonly reputationService: ReputationService;
    constructor(
        @Inject(providers.REPUTATION_SERVICE.name) private client: ClientGrpc,
    ) {
        this.reputationService = this.client.getService(ReputationService.name);
    }
    @Patch('')
    async updateReputation(@Tid() tid: string, @Body() data: ChangeReputation) {
        if (data.tid === tid) {
            throw API_ERROR.CAN_NOT_UPDATE_SELF_REPUTATION;
        }
        return this.reputationService.changeReputation(data);
    }
}
