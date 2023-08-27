import { DynamicModule, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { KeypairModule } from '@app/keypair';

@Module({
    imports: [KeypairModule.forRoot()],
})
export class JwtModule {
    static use(): DynamicModule {
        return {
            module: JwtModule,
            providers: [JwtService],
            exports: [JwtService],
        };
    }
}
