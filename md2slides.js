#!/usr/bin/env node

import { Command } from 'commander';
import { upCommand } from './commands/up.js';

const program = new Command();

program
.name('md2slides')
.description('Markdown to Slides CLI');

program
.command('up')
.description('Start local presentation server')
.action(async () => {
await upCommand();
});

program.parse();