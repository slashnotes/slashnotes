import type { Command } from 'commander'
import { Server } from '@slashnotes/server'

export function action () {
  const server = new Server()
  server.start()
}

export function Start (program: Command) {
  program
    .command('start')
    .description('Start Slashnotes')
    .action(action)
}
