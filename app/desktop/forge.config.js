// eslint-disable-next-line @typescript-eslint/no-var-requires
const process = require('process')

const packagerConfig = {
  name: 'Slashnotes',
  asar: true,
}

const makers = [
  { name: '@electron-forge/maker-squirrel' },
  {
    name: '@electron-forge/maker-zip',
    platforms: ['darwin', 'linux'],
  }
]

switch (process.platform) {
  case 'win32':
    packagerConfig['icon'] = './icon.ico'
    break
  case 'darwin':
    packagerConfig['icon'] = './icon.icns'
    break
}

module.exports = {
  packagerConfig,
  makers
}
