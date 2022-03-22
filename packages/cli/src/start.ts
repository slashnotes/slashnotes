import type { Command } from 'commander'
import { Server } from '@slashnotes/server'
import { platform } from 'os'
import { exec } from 'child_process'

export function action () {
  const server = new Server()
  server.start()
  switch (platform()) {
    case 'darwin':
      exec('open http://localhost:3000')
      break
  }
}

export function Start (program: Command) {
  program
    .command('start')
    .description('Start Slashnotes')
    .action(action)
}
