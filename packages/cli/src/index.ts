#!/usr/bin/env node --experimental-specifier-resolution=node

import { Command } from 'commander'
import { Init } from './init'
import { Build } from './build'
import { Server } from './server'

const program = new Command()

program
  .name('Slashnotes')
  .usage('[command] [flags]')

Init(program)
Build(program)
Server(program)

program.parse()
