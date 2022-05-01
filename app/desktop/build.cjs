/* eslint-disable @typescript-eslint/no-var-requires */
const packageLock = require('./package-lock.json')
const package = require('./package.json')
const { writeFileSync } = require('fs')

package.version = packageLock.dependencies['@slashnotes/desktop'].version

writeFileSync('./package.json', JSON.stringify(package, null, 2))
