import {
  sep, join, dirname, basename,
} from 'path'
import {
  existsSync, mkdirSync, renameSync, rmSync
} from 'fs'
import type { Options } from '..'

export function File (name: string, params: any, options: Options) {
  switch (name) {
    case 'read':
      if (!options.files[params.type]) throw Error(`Unknown file type: ${params.type}`)

      return options.files[params.type].read({ filename: join(params.folder, params.path) })
    case 'write': {
      if (!options.files[params.type]) throw Error(`Unknown file type: ${params.type}`)

      options.files[params.type].write({
        filename: join(params.folder, params.path),
        body: params.body
      })

      return
    }
    case 'view': {
      if (!options.files[params.type]) throw Error(`Unknown file type: ${params.type}`)

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
      if (!options.files[params.type]) throw Error(`Unknown file type: ${params.type}`)

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
      throw Error(`Unknown command: file/${name}`)
  }
}
