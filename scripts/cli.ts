import { Command } from 'commander';
import build from './build';
import dev, { genTypes } from './dev';

const program = new Command('Taco');
program.command('build <modules...>').action(async (modules) => {
    await build(modules);
});
program.command('dev <modules...>').action(async (modules) => {
    await dev(modules);
});
program.command('generate-type').action(() => {
    genTypes();
});

program.parse(process.argv);
