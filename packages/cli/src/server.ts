import { createServer as createHttpServer } from 'http'
import { readFileSync, existsSync } from 'fs'
import { join, extname } from 'path'

const ContentTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
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
      if (path === '/')
        path = 'index.html'
      if (existsSync(join(webPath, path))) {
        console.log(extname(path))
        res.setHeader('Content-Type', ContentTypes[extname(path)])
        res.write(readFileSync(join(webPath, path)))
      } else {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.write('Not found file: ' + path)
      }
      res.end()
    })
      .listen(this.port)

    return this
  }
}
