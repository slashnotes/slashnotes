#!/usr/bin/env node

import { Command } from 'commander'
import { Init } from './init'
import { Start } from './start'

const program = new Command()

program
  .name('Slashnotes')
  .usage('[command] [flags]')

Init(program)
Start(program)

program.parse()
