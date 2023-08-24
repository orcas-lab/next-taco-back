import { Controller } from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { GrpcMethod } from '@nestjs/microservices';
import { ChangeReputation } from '@app/dto';

@Controller()
export class ReputationController {
    constructor(private readonly reputationService: ReputationService) {}

    @GrpcMethod('ReputationService', 'change')
    changeReputation(data: ChangeReputation) {
        return this.reputationService.changeReputation(data);
    }
}
