import type { Command } from 'commander'
import { Server } from '@slashnotes/server'
import { platform } from 'os'
import { exec } from 'child_process'
import { resolve } from 'path'

export function action (
  options: {
    port: string
    open: boolean
    folder: string
  }
) {
  options.folder = resolve(options.folder)
  const server = new Server(options)
  server.start()

  if (options.open)
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
    .option('-f --folder <folder>', 'folder to build', '.')
    .option('--no-open', 'Don\'t open browser')
    .action(action)
}
