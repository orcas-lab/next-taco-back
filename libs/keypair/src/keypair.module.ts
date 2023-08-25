import { DynamicModule, Module } from '@nestjs/common';
import { KeypairService } from './keypair.service';
import { ConfigModule } from '@app/config';

@Module({
    imports: [ConfigModule.forRoot('config.toml')],
})
export class KeypairModule {
    static forRoot(): DynamicModule {
        return {
            module: KeypairModule,
            providers: [KeypairService],
            exports: [KeypairService],
            imports: [ConfigModule.forRoot('config.toml')],
        };
    }
}
