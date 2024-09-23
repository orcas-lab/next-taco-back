import { DynamicModule, Module, Provider } from '@nestjs/common';
import { KeysService } from './keys.service';
import { KeyModuleClass, ASYNC_OPTIONS_TYPE } from './key.factory';

@Module({
  providers: [KeysService],
  exports: [KeysService],
})
export class KeysModule extends KeyModuleClass {
  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const module = super.registerAsync(options);
    const providers: Provider[] = [KeysService, ...module.providers];
    return {
      module: KeysModule,
      imports: [...module.imports],
      providers,
      exports: [...(module.exports ?? []), KeysModule],
    };
  }
}
