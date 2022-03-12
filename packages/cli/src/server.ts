import { createServer as createHttpServer } from 'http'
import {
  readFileSync, existsSync, readdirSync, statSync
} from 'fs'
import {
  join, extname, sep
} from 'path'

const ContentTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
}


function findPosts (dir: string, cwd: string, prev?: string[]): string[] {
  if (!prev) prev = []

  readdirSync(dir).forEach(f => {
    const subPath = join(dir, f)
    if (statSync(subPath).isDirectory())
      return findPosts(subPath, cwd, prev)

    if (f.endsWith('.post.md'))
      prev.push(subPath.replace(cwd, '').replace('.post.md', ''))
  })

  return prev
}


export class Server {
  public readonly port: number

  constructor () {
    this.port = 3000
  }

  public async start () {
    const webPath = require.resolve('@slashnotes/web').replace(/index.js$/, 'dist')
    console.log(webPath)
    createHttpServer(async (req, res) => {
      console.log(req.url)

      let path = req.url

      try {
        if (path.startsWith('/__slashnotes/')) {
          const command = path.replace('/__slashnotes/', '')
          switch (command) {
            case 'list':
              res.writeHead(200, { 'Content-Type': 'application/json' })
                .end(JSON.stringify(findPosts(process.cwd(), process.cwd() + sep)))
              return
            default:
              res
                .writeHead(500, { 'Content-Type': 'text/plain' })
                .end('Unknown command: ' + command)
              return
          }
        }

        if (path === '/') path = 'index.html'

        if (existsSync(join(webPath, path))) {
          res
            .writeHead(200, { 'Content-Type': ContentTypes[extname(path)] })
            .end(readFileSync(join(webPath, path)))
          return
        }

        res
          .writeHead(404, { 'Content-Type': 'text/plain' })
          .end('Not found file: ' + path)
      } catch (error) {
        res
          .writeHead(500, { 'Content-Type': 'text/plain' })
          .end(error.message)
      }
    })
      .listen(this.port)

    return this
  }
}
