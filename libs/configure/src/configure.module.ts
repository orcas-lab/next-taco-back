import { DynamicModule, Module } from '@nestjs/common';
import { ConfigureService } from './configure.service';
import { readFileSync } from 'fs';
import { CONFIG_OPTION } from './constance';

@Module({})
export class ConfigureModule {
    static forRoot(path: string): DynamicModule {
        const raw = readFileSync(path).toString();
        return {
            module: ConfigureModule,
            providers: [
                {
                    provide: CONFIG_OPTION,
                    useValue: raw,
                },
                ConfigureService,
            ],
            exports: [ConfigureModule, ConfigureService],
            global: true,
        };
    }
}
