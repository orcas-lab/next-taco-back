import { DynamicModule, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { ConfigureModule } from '@app/configure';

@Module({})
export class JwtModule {
    static use(): DynamicModule {
        return {
            module: JwtModule,
            imports: [ConfigureModule.forRoot('config.toml')],
            providers: [JwtService],
            exports: [JwtService],
            global: true,
        };
    }
}
