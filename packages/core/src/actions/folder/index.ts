import type { SlashnotesFile, SlashnotesItem } from '@slashnotes/types'
import type { Options } from '..'
import {
  join, extname, sep 
} from 'path'
import {
  existsSync, mkdirSync, renameSync, readdirSync, statSync
} from 'fs'

type Files = {
  [type: string]: SlashnotesFile
}

type AllFiles = {
  [path: string]: SlashnotesItem & {
    mode: 'view'
  }
}

export function findFiles (dir: string, cwd: string, files: Files, prev?: AllFiles): AllFiles {
  if (!prev) prev = {}

  readdirSync(dir).forEach(f => {
    const subPath = join(dir, f)
    if (statSync(subPath).isDirectory() && !subPath.includes('node_modules'))
      return findFiles(subPath, cwd, files, prev)

    const ext = extname(f)
    if (files[ext]) {
      const path = subPath.replace(cwd, '')
      const paths = path.split(sep)
      prev[path] = {
        path,
        name: paths[paths.length - 1],
        type: ext,
        mode: 'view',
      }
    }
  })

  return prev
}

export function Folder (name: string, params: any, options: Options) {
  switch (name) {
    case 'list':
      return findFiles(params.folder, params.folder + sep, options.files)
    case 'rename': {
      const dir = join(params.folder, params.to)
      if (!existsSync(dir))
        mkdirSync(dir, { recursive: true })
      renameSync(join(params.folder, params.from), join(params.folder, params.to))
      return
    }
    default:
      throw Error('Unknown command: folder/' + name)
  }
}
