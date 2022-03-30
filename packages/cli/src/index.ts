#!/usr/bin/env node

import { Command } from 'commander'
import { Init } from './init'
import { Build } from 'build'
import { Start } from './start'

const program = new Command()

program
  .name('Slashnotes')
  .usage('[command] [flags]')

Init(program)
Build(program)
Start(program)

program.parse()
