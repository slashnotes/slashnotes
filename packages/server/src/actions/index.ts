import { Config } from './config'
import { File } from './file'
import { Folder } from './folder'
import type { SlashnotesFile } from '@slashnotes/types'

export type Options = {
  files: {
    [type: string]: SlashnotesFile
  }
}

export function Actions (name: string, params: any, options: Options) {
  if (name.startsWith('config')) return { data: Config(name.replace('config/', ''), params) }
  if (name.startsWith('file')) return { data: File(name.replace('file/', ''), params, options) }
  if (name.startsWith('folder')) return { data: Folder(name.replace('folder/', ''), params) }

  throw Error('Unknown command: ' + name)
}
