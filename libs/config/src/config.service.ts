import { Injectable, Inject } from '@nestjs/common';
import {
    ConfigTemplate,
    GetTypeByTemplate,
} from '@app/interface/configure.interface';
import { CONFIG_OPTION } from './constance';
import { parse } from 'toml';

@Injectable()
export class ConfigService {
    private config: any;
    constructor(@Inject(CONFIG_OPTION) private readonly configOption: any) {
        this.config = parse(this.configOption);
    }
    get<T extends ConfigTemplate>(key: ConfigTemplate): GetTypeByTemplate<T> {
        const path = key.split('.');
        let tmp = this.config;
        while (path.length) {
            const key = path.shift();
            tmp = tmp?.[key];
            if (!tmp) {
                return null;
            }
        }
        return tmp as GetTypeByTemplate<T>;
    }
}
