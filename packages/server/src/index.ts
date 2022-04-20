import { Logger } from '@faasjs/logger'
import { SlashnotesFile } from '@slashnotes/types'
import { WebSocketServer } from 'ws'
import { Actions, Options } from './actions'

export class Server {
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

        ws.send(JSON.stringify({
          id,
          ...Actions(name, params, this.options),
        }))
      })
    })

    this.logger.info('Slashnotes running at http://localhost:' + this.port)

    return this
  }
}
