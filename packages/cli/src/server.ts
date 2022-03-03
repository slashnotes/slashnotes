import { createServer } from 'http'
import { compileSync } from '@mdx-js/mdx'
import { readFileSync } from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export class Server {
  public readonly port: number

  constructor () {
    this.port = 3000
  }

  public async start () {
    createServer((req, res) => {
      console.log(req.url)
      if (req.url.startsWith('/node_modules')) {
        const name = req.url.replace('/node_modules/', '')
        const path = require.resolve(name)
        console.log(path)
        res.setHeader('Content-Type', 'text/javascript')
        res.end(readFileSync(path))
        return
      }
      res.setHeader('Content-Type', 'text/html')
      res.write(
        '<!DOCTYPE html><body><script type="module">' +
        compileSync(
          readFileSync('home.mdx', 'utf8').toString()
        ).toString()
        + '</script></body>'
      )
      res.end()
    })
      .listen(this.port)

    return this
  }
}
