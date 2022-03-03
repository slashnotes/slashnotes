import type { Command } from 'commander'
import { Server } from './server'

export function action () {
  console.log('Start')
  const server = new Server()
  server.start()
}

export function Start (program: Command) {
  program
    .command('start')
    .description('Start Slashnotes')
    .action(action)
}
