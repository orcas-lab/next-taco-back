import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@app/config';
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';
import { ROOT } from '@app/constant';
import { KeysModule } from '@app/keys';
import { JwtModule } from '@app/jwt';

@Module({
    imports: [ConfigModule.forRoot('config.toml'), KeysModule, JwtModule],
})
export class AppModule implements OnModuleInit {
    private logger = new Logger('APP');
    constructor(private config: ConfigService) {}
    onModuleInit() {
        writeFileSync(join(ROOT, 'lock'), '');
    }
}
