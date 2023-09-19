import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AccountModule } from './account/account.module';

@Module({
  imports: [AccountModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
