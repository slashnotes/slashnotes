#!/usr/bin/env node

import { Command } from 'commander'
import { Start } from './start'

const program = new Command()

program
  .name('Slashnotes')
  .usage('[command] [flags]')

Start(program)

program.parse()
