import { createServer as createHttpServer } from 'http'
import {
  readFileSync, existsSync, readdirSync, statSync, renameSync, mkdirSync, rmSync
} from 'fs'
import {
  join, extname, sep, dirname, basename
} from 'path'
import { createRequire } from 'module'
import { Logger } from '@faasjs/logger'
import { Md } from '@slashnotes/md'
import { SlashnotesItem, SlashnotesFile } from '@slashnotes/types'

type Files = {
  [type: string]: SlashnotesFile
}

const ContentTypes: {
  [key: string]: string
} = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.ttf': 'font/ttf',
}

const require = createRequire(import.meta.url)

function findFiles (dir: string, cwd: string, files: Files, prev?: SlashnotesItem[]): SlashnotesItem[] {
  if (!prev) prev = []

  readdirSync(dir).forEach(f => {
    const subPath = join(dir, f)
    if (statSync(subPath).isDirectory() && !subPath.includes('node_modules'))
      return findFiles(subPath, cwd, files, prev)

    const ext = extname(f)
    if (files[ext]) {
      const path = subPath.replace(cwd, '')
      const paths = path.split(sep)
      prev.push({
        path,
        name: paths[paths.length - 1],
        paths,
        type: ext
      })
    }
  })

  return prev
}

export class Server {
  public readonly port: number | string
  public readonly folder: string
  public readonly logger: Logger
  public readonly files: Files

  constructor (options?: {
    port: number | string
    folder: string
  }) {
    this.port = process.env.PORT || options?.port || 3000
    this.folder = options.folder
    console.log(this.folder)
    this.logger = new Logger()
    this.files = { '.md': Md }
  }

  public async start () {
    const webPath = require.resolve('@slashnotes/web').replace(/index.js$/, 'dist')

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
            switch (command) {
              case 'list':
                res
                  .writeHead(200, headers)
                  .end(JSON.stringify(findFiles(this.folder, this.folder + sep, this.files)))
                return
              case 'read': {
                const data = JSON.parse(body)

                if (!this.files[data.type]) throw Error('Unknown file type: ' + data.type)

                res
                  .writeHead(200, headers)
                  .end(this.files[data.type].read({ filename: join(this.folder, data.path) }))
                return
              }
              case 'write': {
                const data = JSON.parse(body)

                if (!this.files[data.type]) throw Error('Unknown file type: ' + data.type)

                this.files[data.type].write({
                  filename: join(this.folder, data.path),
                  body: data.body
                })
                res
                  .writeHead(201, headers)
                  .end()
                return
              }
              case 'view': {
                const data = JSON.parse(body)

                if (!this.files[data.type]) throw Error('Unknown file type: ' + data.type)

                res
                  .writeHead(200, headers)
                  .end(this.files[data.type].render({ filename: join(this.folder, data.path) }))
                return
              }
              case 'rename': {
                const data = JSON.parse(body)
                const dir = join(this.folder, dirname(data.to))
                if (!existsSync(dir))
                  mkdirSync(dir, { recursive: true })
                renameSync(join(this.folder, data.from), join(this.folder, data.to))
                res
                  .writeHead(201, headers)
                  .end()
                return
              }
              case 'add': {
                const data = JSON.parse(body)

                if (!this.files[data.type]) throw Error('Unknown file type: ' + data.type)

                const path = join(this.folder, ...data.paths) + data.type
                const dir = dirname(path)
                if (!existsSync(dir))
                  mkdirSync(dir, { recursive: true })

                this.files[data.type].create({ filename: path })

                res
                  .writeHead(200, headers)
                  .end(JSON.stringify({
                    item: {
                      type: data.type,
                      name: basename(path),
                      path: path.replace(this.folder + sep, ''),
                      paths: path.replace(this.folder + sep, '').split(sep),
                    }
                  }))
                return
              }
              case 'delete': {
                const data = JSON.parse(body)
                rmSync(join(this.folder, data.path))
                res
                  .writeHead(201, headers)
                  .end()
                return
              }
              default:
                console.error('Unknown command', command)
                res
                  .writeHead(500, {
                    ...headers,
                    'Content-Type': 'text/plain'
                  })
                  .end('Unknown command: ' + command)
                return
            }
          }

          if (path === '/') path = 'index.html'

          if (existsSync(join(webPath, path))) {
            res
              .writeHead(200, {
                ...headers,
                'Content-Type': ContentTypes[extname(path)]
              })
              .end(readFileSync(join(webPath, path)))
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
