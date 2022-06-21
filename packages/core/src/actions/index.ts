import type { SlashnotesFile } from '@slashnotes/types'
import { Config } from './config'
import { File } from './file'
import { Folder } from './folder'
import { Search } from './search'
import { Sync } from './sync'

export type Options = {
  files: {
    [type: string]: SlashnotesFile
  }
  web(props: any): JSX.Element
}

export async function Actions (name: string, params: any, options: Options) {
  if (name.startsWith('config')) return { data: await Config(name.replace('config/', ''), params) }
  if (name.startsWith('file')) return { data: await File(name.replace('file/', ''), params, options) }
  if (name.startsWith('folder')) return { data: await Folder(name.replace('folder/', ''), params, options) }
  if (name.startsWith('search')) return { data: await Search(name.replace('search/', ''), params, options) }
  if (name.startsWith('sync')) return { data: await Sync(name.replace('sync/', ''), params, options) }

  throw Error('Unknown command: ' + name)
}
