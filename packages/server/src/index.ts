import { createServer as createHttpServer } from 'http'
import { existsSync, createReadStream } from 'fs'
import { join, extname } from 'path'
import { createRequire } from 'module'
import { Logger } from '@faasjs/logger'
import { SlashnotesFile } from '@slashnotes/types'
import { Config } from './actions/config'
import { File } from './actions/file'
import { Folder } from './actions/folder'

const ContentTypes: {
  [key: string]: string
} = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.ttf': 'font/ttf',
}

const require = createRequire(import.meta.url)

export class Server {
  public readonly port: number | string
  public readonly folder: string
  public readonly logger: Logger
  public readonly files: {
    [type: string]: SlashnotesFile
  }

  constructor (options: {
    port: number | string
    folder: string
    files: SlashnotesFile[]
  }) {
    this.port = process.env.PORT || options?.port || 3000
    this.folder = options.folder
    console.log(this.folder)
    this.logger = new Logger()
    this.files = Object.assign({}, ...options.files.map(file => ({ [file.extname]: file })))
  }

  public async start () {
    const webPath = require.resolve('@slashnotes/desktop').replace(/index.js$/, 'dist')

    createHttpServer(async (req, res) => {
      this.logger.debug('%s %s', req.method, req.url)
      const headers: {
        [key: string]: string
      } = {
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
      }

      if (req.method === 'OPTIONS') {
        headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        for (const key in headers)
          res.setHeader(key, headers[key])
        res.statusCode = 204
        res.end()
        return
      }

      let path = req.url

      let body = ''

      req.on('readable', function () {
        body += req.read() || ''
      })

      req.on('end', async () => {
        try {
          if (path.startsWith('/__slashnotes/')) {
            const command = path.replace('/__slashnotes/', '')
            if (command.startsWith('config/')) {
              Config({
                command: command.replace('config/', ''),
                headers,
                res,
              })

              return
            }

            if (command.startsWith('file/')) {
              File({
                command: command.replace('file/', ''),
                headers,
                res,
                folder: this.folder,
                files: this.files,
                data: body ? JSON.parse(body) : {},
              })
              return
            }

            if (command.startsWith('folder/')) {
              Folder({
                command: command.replace('folder/', ''),
                headers,
                res,
                folder: this.folder,
                data: body ? JSON.parse(body) : {},
              })
              return
            }

            console.error('Unknown command', command)
            res
              .writeHead(500, {
                ...headers,
                'Content-Type': 'text/plain'
              })
              .end('Unknown command: ' + command)
            return
          }

          if (path === '/') path = 'index.html'

          if (existsSync(join(webPath, path))) {
            res
              .writeHead(200, {
                ...headers,
                'Content-Type': ContentTypes[extname(path)]
              })
            const stream = createReadStream(join(webPath, path))
            stream.on('open', () => stream.pipe(res))
            stream.on('error', err => res.end(err))
            return
          }

          res
            .writeHead(404, {
              ...headers,
              'Content-Type': 'text/plain'
            })
            .end('Not found file: ' + path)
        } catch (error: any) {
          console.error(error)
          res
            .writeHead(500, {
              ...headers,
              'Content-Type': 'text/plain'
            })
            .end(error.message)
        }
      })
    })
      .listen(this.port)

    this.logger.info('Slashnotes running at http://localhost:' + this.port)

    return this
  }
}
