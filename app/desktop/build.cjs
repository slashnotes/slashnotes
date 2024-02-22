const packageLock = require('./package-lock.json')
const packageJSON = require('./package.json')
const { writeFileSync } = require('fs')

packageJSON.version = packageLock.dependencies['@slashnotes/desktop'].version

writeFileSync('./package.json', JSON.stringify(packageJSON, null, 2))
