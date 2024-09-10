import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@app/config';
import { join } from 'node:path';
import { existsSync, writeFileSync } from 'node:fs';
import {
  DATA_ROOT,
  KEY_ROOT,
  ROOT,
  SERVER_PRI_KEY_NAME,
  SERVER_PUB_KEY_NAME,
} from '@app/constant';
import { keyGen } from '../keygen';
import { JwtModule } from '@app/jwt';

@Module({
  imports: [ConfigModule.forRoot('config.toml'), JwtModule.use()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private logger = new Logger('APP');
  constructor(private config: ConfigService) {}
  onModuleInit() {
    const override = this.config.get('app.override');
    if (existsSync(DATA_ROOT) && !override) {
      this.logger.warn(
        `dist/data exists, If you want init server agin, please remove dist/data or set true for app.override in config.toml `,
      );
      return;
    }
    const { pubKeyString: ServerPub, priKeyString: ServerPri } = keyGen();
    writeFileSync(join(KEY_ROOT, SERVER_PUB_KEY_NAME), ServerPub);
    this.logger.verbose('generate server public key success');
    writeFileSync(join(KEY_ROOT, SERVER_PRI_KEY_NAME), ServerPri);
    this.logger.verbose('generate server private key success');
    writeFileSync(join(ROOT, 'lock'), '');
  }
}
