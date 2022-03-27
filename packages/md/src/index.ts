import {
  readFileSync, existsSync, readdirSync, statSync, writeFileSync, renameSync, mkdirSync, rmSync
} from 'fs'
import {
  join, extname, sep, dirname,
} from 'path'
import { SlashnotesFile } from '@slashnotes/types'

import { build } from './build'
import { parse } from './parse'

export const Md: SlashnotesFile = {
  extname: '.md',
  read ({ folder, path }) {
    return JSON.stringify({ body: readFileSync(join(folder, path)).toString() })
  },
  parse ({ folder, path }) {
    const file = readFileSync(join(folder, path)).toString()
    return JSON.stringify({ body: parse(file) })
  }
}
