import type { Command } from 'commander'
import { Server } from '@slashnotes/server'
import { platform } from 'os'
import { exec } from 'child_process'

export function action (
  _: any,
  options: {
    port: number | string
  }
) {
  const server = new Server(options)
  server.start()

  switch (platform()) {
    case 'darwin':
      exec('open http://localhost:' + server.port)
      break
  }
}

export function Start (program: Command) {
  program
    .command('start')
    .description('Start server')
    .option('-p --port <port>', 'Port to listen on', '3000')
    .action(action)
}
