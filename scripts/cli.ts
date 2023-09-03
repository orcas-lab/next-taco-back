import { Command } from 'commander';
import build from './build';

const program = new Command('Taco');
program.command('build [modules]').action(async (modules) => {
    await build(modules);
});

program.parse(process.argv);
