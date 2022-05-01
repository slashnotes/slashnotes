import type { Options } from '..'
import type { SlashnotesFile, SlashnotesItem } from '@slashnotes/types'
import {
  sep, join, extname
} from 'path'
import { readdirSync, statSync } from 'fs'

type Files = {
  [type: string]: SlashnotesFile
}

type AllFiles = {
  [path: string]: {
    item: SlashnotesItem
    content: any
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
        item: {
          path,
          name: paths[paths.length - 1],
          type: ext,
        },
        content: files[ext].searchableContent({ filename: subPath })
      }
    }
  })

  return prev
}

export function Search (name: string, params: any, options: Options) {
  switch (name) {
    case 'search': {
      const files = Object.values(findFiles(params.folder, params.folder + sep, options.files))
      let result: {
        item: SlashnotesItem
      }[] = []

      for (const file of Object.values(options.files)) {
        result = result.concat(file.search({
          q: params.q,
          contents: files,
        }))
      }

      return result
    }
    default:
      throw Error('Unknown command: search/' + name)
  }
}
