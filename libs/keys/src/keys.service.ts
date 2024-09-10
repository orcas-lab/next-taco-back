import {
    JWT_PRI_KEY_NAME,
    JWT_PUB_KEY_NAME,
    KEY_ROOT,
    SERVER_PRI_KEY_NAME,
    SERVER_PUB_KEY_NAME,
} from '@app/constant';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class KeysService {
    get jwt() {
        const pub = readFileSync(join(KEY_ROOT, JWT_PUB_KEY_NAME)).toString();
        const pri = readFileSync(join(KEY_ROOT, JWT_PRI_KEY_NAME)).toString();
        return {
            pub,
            pri,
        };
    }
    get sign() {
        const pub = readFileSync(
            join(KEY_ROOT, SERVER_PUB_KEY_NAME),
        ).toString();
        const pri = readFileSync(
            join(KEY_ROOT, SERVER_PRI_KEY_NAME),
        ).toString();
        return {
            pub,
            pri,
        };
    }
}
