import {
    DynamicModule,
    Global,
    Logger,
    Module,
    OnModuleInit,
} from '@nestjs/common';
import { KeysService } from './keys.service';
import { ConfigService } from '@app/config';
import {
    KEY_ROOT,
    JWT_PUB_KEY_NAME,
    JWT_PRI_KEY_NAME,
    SERVER_PRI_KEY_NAME,
    SERVER_PUB_KEY_NAME,
} from '@app/constant';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { removeSync } from 'fs-extra';
import { keyGen } from '../../../keygen';
import { join } from 'node:path';

@Global()
@Module({
    providers: [KeysService],
    exports: [KeysService],
})
export class KeysModule implements OnModuleInit {
    private logger: Logger = new Logger('Keys Module');
    constructor(private config: ConfigService) {}
    onModuleInit() {
        const override = this.config.get('app.override');
        if (override) {
            this.logger.verbose(`Override: ${override}`);
        }
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
        const { pubKeyString: ServerPub, priKeyString: ServerPri } = keyGen();
        writeFileSync(join(KEY_ROOT, SERVER_PUB_KEY_NAME), ServerPub);
        this.logger.verbose('generate server public key success');
        writeFileSync(join(KEY_ROOT, SERVER_PRI_KEY_NAME), ServerPri);
        this.logger.verbose('generate server private key success');
    }
}
