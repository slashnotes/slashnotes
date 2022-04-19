/* eslint-disable @typescript-eslint/no-var-requires */
const { join, dirname } = require('path')

const Server = require(join(dirname(require.resolve('@slashnotes/server')), 'index.cjs')).Server
const Md = require(join(dirname(require.resolve('@slashnotes/md')), 'index.cjs')).default

const server = new Server({
  port: 3000,
  folder: __dirname,
  files: [Md]
})
server.start()
