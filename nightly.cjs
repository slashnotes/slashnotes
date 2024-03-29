const { version } = require('./package.json')
const { execSync } = require('child_process')
const { readFileSync, writeFileSync } = require('fs')

const newVersion = `${version}-nightly-${Date.now()}`

for (const name of [
  'cli',
  'core',
  'desktop',
  'md',
  'slashnotes',
  'types',
  'web',
]) {
  const packagePath = `${__dirname}/packages/${name}/package.json`
  const pkg = JSON.parse(readFileSync(packagePath).toString())
  pkg.version = newVersion
  writeFileSync(packagePath, JSON.stringify(pkg, null, 2))
  execSync(`npm publish -w packages/${name} --access public`, {
    stdio: 'inherit',
  })
  execSync(`npm dist-tag add ${pkg.name}@${newVersion} nightly`)
}
