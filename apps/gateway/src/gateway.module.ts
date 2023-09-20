import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AccountModule } from './account/account.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AccountModule, UserModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
