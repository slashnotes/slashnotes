/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process')
const { join } = require('path')

execSync(`cp ${join(__dirname, '..', '..', 'packages', 'server')}/dist/index.cjs dist/server.cjs`)

execSync(`cp ${join(__dirname,'..', '..', 'packages', 'md')}/dist/index.cjs dist/md.cjs`)
