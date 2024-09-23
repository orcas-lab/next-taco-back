import { ConfigOption } from '@app/interface/configure.interface';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const {
  ConfigurableModuleClass: KeyModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<ConfigOption['keys']>().build();
