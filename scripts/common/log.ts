import chalk from 'chalk';
export const success = (msg) => chalk.green(msg);
export const warning = (msg) => chalk.yellow(msg);
export const error = (msg) => chalk.red(msg);
