import { execSync } from 'child_process';
import concurrently from 'concurrently';
import { readdirSync } from 'fs';
import { model } from 'mongoose';
import { join } from 'path';
export default async (modules: string[]) => {
    const cmds = [];
    for (const module of modules) {
        cmds.push(`pnpm start:dev ${module}`);
    }
    await concurrently(cmds);
};
export const genTypes = () => {
    const modules = readdirSync(join(__dirname, '../proto/'))
        .map((v) => `./proto/${v}`)
        .filter((v) => !v.includes('.types'));
    for (const module of modules) {
        execSync(
            `proto-loader-gen-types --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=./libs/interface/src/implement ${module}`,
        );
    }
};
