import type { Command } from 'commander'
import { platform } from 'os'
import { exec } from 'child_process'
import { resolve } from 'path'
import Md from '@slashnotes/md'

import { Logger } from '@faasjs/logger'
import { SlashnotesFile } from '@slashnotes/types'
import { WebSocketServer } from 'ws'
import { Actions, Options } from '@slashnotes/core'

export class WebServer {
  public readonly port: number | string
  public readonly folder: string
  public readonly logger: Logger
  public readonly options: Options

  constructor (options: {
    port: number | string
    folder: string
    files: SlashnotesFile[]
  }) {
    this.port = process.env.PORT || options?.port || 3000
    this.folder = options.folder
    console.log(this.folder)
    this.logger = new Logger()
    this.options = { files: Object.assign({}, ...options.files.map(file => ({ [file.extname]: file }))) }
  }

  public async start () {
    const wss = new WebSocketServer({ port: this.port as number })
    wss.on('connection', (ws) => {
      console.log('connected')
      ws.on('message', (data: Buffer) => {
        console.log(data.toString())
        const {
          id, name, params
        } = JSON.parse(data.toString())

        try {
          ws.send(JSON.stringify({
            id,
            ...Actions(name, params, this.options),
          }))
        } catch (error: any) {
          ws.send(JSON.stringify({
            id,
            error: error.message,
          }))
        }
      })
    })

    this.logger.info('Slashnotes running at http://localhost:' + this.port)

    return this
  }
}


export function action (
  options: {
    port: string
    open: boolean
    folder: string
  }
) {
  options.folder = resolve(options.folder)
  const server = new WebServer({
    folder: options.folder,
    port: options.port,
    files: [Md()]
  })
  server.start()

  if (options.open)
    switch (platform()) {
      case 'darwin':
        exec('open http://localhost:' + server.port)
        break
    }
}

export function Server (program: Command) {
  program
    .command('server')
    .description('Start web server')
    .option('-p --port <port>', 'Port to listen on', '3000')
    .option('-f --folder <folder>', 'folder to build', '.')
    .option('--no-open', 'Don\'t open browser')
    .action(action)
}
