import { exec } from 'child_process';
import { copySync, readdirSync, removeSync } from 'fs-extra';
import ProgressBar from 'progress';
import { success } from './common/log';
import { join } from 'path';
import { copyFileSync, existsSync } from 'fs';
const buildSingle = (moduleName: string) => {
    return new Promise((resolve, reject) => {
        exec(`nest build ${moduleName}`, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

const build = async (modules?: string[]) => {
    if (existsSync(join(__dirname, '../dist'))) {
        removeSync(join(__dirname, '../dist'));
    }
    const scopeModules = modules ?? readdirSync('apps/');
    const bar = new ProgressBar('Building [:bar] :percent :name', {
        total: scopeModules.length,
        width: 20,
    });
    for (let i = 0; i < scopeModules.length; i++) {
        const name = scopeModules[i];
        await buildSingle(name);
        bar.tick({ name: success(name) });
    }
    copyFileSync(
        join(__dirname, '../package.json'),
        join(__dirname, '../dist/package.json'),
    );
    copySync(join(__dirname, '../proto'), join(__dirname, '../dist/proto'));
    console.log(success('Build success'));
};

export default build;
