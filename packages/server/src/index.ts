import { createServer as createHttpServer } from 'http'
import {
  readFileSync, existsSync, readdirSync, statSync, writeFileSync, renameSync, mkdirSync, rmSync
} from 'fs'
import {
  join, extname, sep, dirname,
} from 'path'
import { createRequire } from 'module'
import { Logger } from '@faasjs/logger'
import { parse } from './markdown'

type Item = {
  type: string
  name: string
  path: string
  paths: string[]
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

function findFiles (dir: string, cwd: string, prev?: Item[]): Item[] {
  if (!prev) prev = []

  readdirSync(dir).forEach(f => {
    const subPath = join(dir, f)
    if (statSync(subPath).isDirectory() && !subPath.includes('node_modules'))
      return findFiles(subPath, cwd, prev)

    if (f.endsWith('.md')) {
      const path = subPath.replace(cwd, '').replace('.md', '')
      const paths = path.split(sep)
      prev.push({
        path,
        name: paths[paths.length - 1],
        paths,
        type: 'default'
      })
    }
  })

  return prev
}

export class Server {
  public readonly port: number | string
  public readonly folder: string
  public readonly logger: Logger

  constructor () {
    this.port = process.env.PORT || 3000
    this.folder = process.env.FOLDER ? join(process.cwd(), process.env.FOLDER) : process.cwd()
    this.logger = new Logger()
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
                  .end(JSON.stringify(findFiles(this.folder, this.folder + sep)))
                return
              case 'read': {
                const data = JSON.parse(body)
                res
                  .writeHead(200, headers)
                  .end(JSON.stringify({ body: readFileSync(join(this.folder, data.path + '.md')).toString() }))
                return
              }
              case 'write': {
                const data = JSON.parse(body)
                writeFileSync(join(this.folder, data.path + '.md'), data.body)
                res
                  .writeHead(201, headers)
                  .end()
                return
              }
              case 'view': {
                const data = JSON.parse(body)
                const file = readFileSync(join(this.folder, data.path + '.md')).toString()
                res
                  .writeHead(200, headers)
                  .end(JSON.stringify({ body: parse(file) }))
                return
              }
              case 'rename': {
                const data = JSON.parse(body)
                const dir = join(this.folder, dirname(data.to))
                if (!existsSync(dir))
                  mkdirSync(dir, { recursive: true })
                renameSync(join(this.folder, data.from + '.md'), join(this.folder, data.to + '.md'))
                res
                  .writeHead(201, headers)
                  .end()
                return
              }
              case 'add': {
                const data = JSON.parse(body)
                const path = data.paths.join(sep)
                const dir = join(this.folder, dirname(path))
                if (!existsSync(dir))
                  mkdirSync(dir, { recursive: true })
                const name = data.paths[data.paths.length - 1]
                writeFileSync(join(this.folder, path + '.md'), `# ${name}\n`)
                res
                  .writeHead(200, headers)
                  .end(JSON.stringify({
                    item: {
                      type: 'default',
                      name,
                      path,
                      paths: data.paths,
                    },
                    body: readFileSync(join(this.folder, path + '.md')).toString()
                  }))
                return
              }
              case 'delete': {
                const data = JSON.parse(body)
                rmSync(join(this.folder, data.path + '.md'))
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
