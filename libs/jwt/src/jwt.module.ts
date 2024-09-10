import { DynamicModule, Logger, Module, OnModuleInit } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { keyGen } from '../../../keygen';
import { join } from 'node:path';
import { JWT_PRI_KEY_NAME, JWT_PUB_KEY_NAME, KEY_ROOT } from '@app/constant';
import { existsSync, writeFileSync } from 'node:fs';
import { ConfigService } from '@app/config';
import { mkdirSync, removeSync } from 'fs-extra';

@Module({
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule implements OnModuleInit {
  private logger: Logger = new Logger('JWT Module');
  constructor(private config: ConfigService) {}
  onModuleInit() {
    const override = this.config.get('app.override');
    if (existsSync(KEY_ROOT) && !override) {
      this.logger.warn(`${KEY_ROOT} exists`);
      return;
    } else {
      if (existsSync(KEY_ROOT)) {
        removeSync(KEY_ROOT);
      }
      mkdirSync(KEY_ROOT, { recursive: true });
    }
    const { pubKeyString: JWTPub, priKeyString: JWTPri } = keyGen();
    writeFileSync(join(KEY_ROOT, JWT_PUB_KEY_NAME), JWTPub);
    this.logger.verbose('generate jwt public key success');
    writeFileSync(join(KEY_ROOT, JWT_PRI_KEY_NAME), JWTPri);
    this.logger.verbose('generate jwt private key success');
  }
  static use(): DynamicModule {
    return {
      global: true,
      module: JwtModule,
      providers: [JwtService],
      exports: [JwtModule, JwtService],
    };
  }
}
