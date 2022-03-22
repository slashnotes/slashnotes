/* eslint-disable @typescript-eslint/no-var-requires */
const { version } = require('./package.json')
const { execSync } = require('child_process')
const { readFileSync, writeFileSync } = require('fs')

const newVersion = version + '-nightly-' + Date.now()

for (const name of [
  'cli',
  'server',
  'web',
  'slashnotes',
]) {
  const packagePath = __dirname + '/packages/' + name + '/package.json'
  const package = JSON.parse(readFileSync(packagePath).toString())
  package.version = newVersion
  writeFileSync(packagePath, JSON.stringify(package, null, 2))
  execSync('npm run build -w packages/' + name, { stdio: 'inherit' })
  execSync('npm publish -w packages/' + name + ' --access public', { stdio: 'inherit' })
}
