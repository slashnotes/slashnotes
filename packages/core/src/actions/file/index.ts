import { SlashnotesFile, SlashnotesItem } from '@slashnotes/types'
import {
  sep, join, extname, dirname, basename,
} from 'path'
import {
  readdirSync, statSync, existsSync, mkdirSync, renameSync, rmSync
} from 'fs'
import type { Options } from '..'

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

export function File (name: string, params: any, options: Options) {
  switch (name) {
    case 'list':
      return findFiles(params.folder, params.folder + sep, options.files)
    case 'read':
      if (!options.files[params.type]) throw Error('Unknown file type: ' + params.type)

      return options.files[params.type].read({ filename: join(params.folder, params.path) })
    case 'write': {
      if (!options.files[params.type]) throw Error('Unknown file type: ' + params.type)

      options.files[params.type].write({
        filename: join(params.folder, params.path),
        body: params.body
      })

      return
    }
    case 'view': {
      if (!options.files[params.type]) throw Error('Unknown file type: ' + params.type)

      return options.files[params.type].render({ filename: join(params.folder, params.path) })
    }
    case 'rename': {
      const dir = join(params.folder, dirname(params.to))

      if (!existsSync(dir))
        mkdirSync(dir, { recursive: true })

      renameSync(join(params.folder, params.from), join(params.folder, params.to))
      return
    }
    case 'add': {
      if (!options.files[params.type]) throw Error('Unknown file type: ' + params.type)

      const path = join(params.folder, ...params.paths) + params.type
      const dir = dirname(path)
      if (!existsSync(dir))
        mkdirSync(dir, { recursive: true })

      options.files[params.type].create({ filename: path })

      return {
        type: params.type,
        name: basename(path),
        path: path.replace(params.folder + sep, ''),
      }
    }
    case 'delete': {
      rmSync(join(params.folder, params.path))

      return
    }
    default:
      throw Error('Unknown command: file/' + name)
  }
}
