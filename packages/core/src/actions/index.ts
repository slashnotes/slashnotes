import type { SlashnotesFile } from '@slashnotes/types'
import { Config } from './config'
import { File } from './file'
import { Folder } from './folder'
import { Search } from './search'

export type Options = {
  files: {
    [type: string]: SlashnotesFile
  }
  web(props: any): JSX.Element
}

export function Actions (name: string, params: any, options: Options) {
  if (name.startsWith('config')) return { data: Config(name.replace('config/', ''), params) }
  if (name.startsWith('file')) return { data: File(name.replace('file/', ''), params, options) }
  if (name.startsWith('folder')) return { data: Folder(name.replace('folder/', ''), params, options) }
  if (name.startsWith('search')) return { data: Search(name.replace('search/', ''), params, options) }

  throw Error('Unknown command: ' + name)
}
