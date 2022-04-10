import { readFileSync, writeFileSync, } from 'fs'
import { basename } from 'path'
import { SlashnotesFile } from '@slashnotes/types'

import { build } from './build'
import { parse } from './parse'

const Md: SlashnotesFile = {
  extname: '.md',
  read ({ filename }) {
    return JSON.stringify({ body: readFileSync(filename).toString() })
  },
  write ({ filename, body }) {
    writeFileSync(filename, body)
  },
  render ({ filename }) {
    const file = readFileSync(filename).toString()
    return JSON.stringify({ body: parse(file) })
  },
  create ({ filename }) {
    writeFileSync(filename, `# ${basename(filename).replace('.md', '')}\n\n`)
  },
  build ({ source, destination }) {
    writeFileSync(destination, build(readFileSync(source).toString()))
  }
}

export default Md
