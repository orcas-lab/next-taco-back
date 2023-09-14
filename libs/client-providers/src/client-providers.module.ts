import { Module } from '@nestjs/common';
import { ClientProvidersService } from './client-providers.service';

@Module({
  providers: [ClientProvidersService],
  exports: [ClientProvidersService],
})
export class ClientProvidersModule {}
