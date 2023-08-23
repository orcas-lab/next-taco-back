import { Module } from '@nestjs/common';
import { KeypairService } from './keypair.service';
import { ConfigModule } from '@app/config';

@Module({
    imports: [ConfigModule.forRoot('config.toml')],
    providers: [KeypairService],
    exports: [KeypairService],
})
export class KeypairModule {}
