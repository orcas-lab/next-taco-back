import { Injectable } from '@nestjs/common';

@Injectable()
export class CmdProcessService {
    _invalidate(cmd: string) {
        return /^\w+\.\w+\.\w+:?.*$/gim.test(cmd);
    }
    parse(cmd: string) {
        const tmp = cmd
            .split('.')
            .filter((item) => item !== '_' && item.length);
        const module = tmp.shift();
        const action = tmp.shift();
        const reciver = tmp.shift();
        const meta: Record<string, string> = JSON.parse(tmp.shift() || '{}');
        return { module, action, reciver, meta };
    }
    get(cmd: string, data?: Record<string, any>[]) {
        const cmds = cmd.split(';');
        if (!cmds.length) {
            return {};
        }
        const info = cmds
            .filter((cmd) => this._invalidate(cmd))
            .map((cmd) => this.parse(cmd));
        for (let i = 0; i < data.length; i++) {
            const [[key, value]] = Object.entries(data[i]);
            for (let j = 0; j < info.length; j++) {
                if (info[j][key]) {
                    info[j][key] = value;
                }
            }
        }
        return info;
    }
}
