import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { readFileSync } from 'node:fs';
import { CONFIG_KEY } from '@app/constant';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  static forRoot(path: string): DynamicModule {
    const raw = readFileSync(path).toString();
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_KEY,
          useValue: raw,
        },
        ConfigService,
      ],
      exports: [ConfigModule, ConfigService],
      global: true,
    };
  }
}
